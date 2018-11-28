'use strict';

let discordBot;
let moment = require('moment');
let config = require('config');
let channels = config.get('claimbot').channels;
const Discord = require('discord.js');
const request = require('request');
let lastProcessedBlock = 0;

module.exports = {
  init: init
};

function init(discordBot_) {
  if (discordBot) {
    throw new Error('init was already called once');
  }

  discordBot = discordBot_;
  console.log('Activating claimbot');
  discordBot.channels.get(channels[0]).send('activating claimbot');
  setInterval(announceClaims, 60 * 1000);
  announceClaims();
}

function announceClaims() {
  let currentBlock = lastProcessedBlock;
  getClaimsForLastBlock()
    .then(claims => {
      claims.forEach(c => {
        if (c.height <= lastProcessedBlock) return;
        currentBlock = Math.max(currentBlock, c.height);

        //filter claims that we don't want to announce
        if (c.bid_state === 'Expired' || c.bid_state === 'Spent') return;

        discordPost(embedFromClaim(c));
      });
    })
    .catch(console.error);
  lastProcessedBlock = currentBlock;
}

/**
 *
 * @param {Object} claim
 * @returns {RichEmbed} discordEmbed
 */
function embedFromClaim(claim) {
  let e = new Discord.RichEmbed();
  const typeClaim = 1,
    typeChannel = 2;
  switch (claim.claim_type) {
    case typeClaim:
      let channelName = claim.channel_name ? claim.channel_name : 'Anonymous';
      let channelPermalink = claim.channel_name ? `${claim.channel_name}#${claim.publisher_id}` : '';
      let claimPermalink = claim.channel_name ? `${channelPermalink}/${claim.name}` : `${claim.name}#${claim.claim_id}`;
      let metadata = JSON.parse(claim.value_as_json).Claim.stream.metadata;
      e.setAuthor(`New claim from ${channelName}`, 'http://barkpost-assets.s3.amazonaws.com/wp-content/uploads/2013/11/3dDoge.gif', `http://open.lbry.io/${claimPermalink}`)
        .setTitle(`lbry://${claimPermalink}`)
        .setURL(`http://open.lbry.io/${claimPermalink}`)
        .setColor(1399626)
        .setFooter(`Block ${claim.height} • Claim ID ${claim.claim_id} • Data from Chainquery`);
      if (metadata.title) e.addField('Title', metadata.title);
      if (claim.channel_name) e.addField('Channel', claim.channel_name);
      if (metadata.description) {
        e.addField('Description', metadata.description.substring(0, 1020));
      }
      if (metadata.fee) e.addField('Fee', `${metadata.fee.amount} ${metadata.fee.currency}`);
      if (metadata.license && metadata.license.length > 2) e.addField('License', metadata.license);
      if (!metadata.nsfw && metadata.thumbnail) e.setImage(metadata.thumbnail);
      if (claim.bid_state !== 'Controlling' && claim.height < claim.valid_at_height) {
        // Claim have not taken over the old claim, send approx time to event.
        let blockTime = 150 * 1000;
        let takeoverTime = Date.now() + (claim.valid_at_height - lastBlockHeight) * blockTime;
        e.addField('Takes effect on approx', `${moment(takeoverTime, 'x').format('MMMM Do [at] HH:mm [UTC]')} • at block height ${claim.valid_at_height}`);
      }
      e.addField('Claimed for', `${Number.parseFloat(claim.bid_amount)} LBC`);
      break;
    case typeChannel:
      e.setAuthor('New channel claim', 'http://barkpost-assets.s3.amazonaws.com/wp-content/uploads/2013/11/3dDoge.gif', `https://open.lbry.io/${claim.name}#${claim.claim_id}`)
        .setTitle(`lbry://${claim.name}`)
        .setURL(`https://open.lbry.io/${claim.name}#${claim.claim_id}`)
        .setColor(1399626)
        .setFooter(`Block ${claim.height} • Claim ID ${claim.claim_id} • Data from Chainquery`)
        .addField('Channel Name', claim.name);
      break;
  }
  return e;
}

/**
 *
 * @returns {Promise} claims in last block
 */
function getClaimsForLastBlock() {
  return new Promise((resolve, reject) => {
    let blockSelectQuery = 'SELECT height FROM block where height > ' + lastProcessedBlock;
    if (lastProcessedBlock === 0) {
      blockSelectQuery = 'SELECT MAX(height) AS height FROM block';
    }
    let query =
      'SELECT t1.*, t3.name AS channel_name, t4.value AS bid_amount FROM claim t1 INNER JOIN (' +
      blockSelectQuery +
      ') t2 ON t1.height = t2.height ' +
      'LEFT JOIN claim t3 ON t1.publisher_id = t3.claim_id LEFT JOIN output t4 ON (t1.transaction_hash_id = t4.transaction_hash AND t1.vout = t4.vout)';
    let options = {
      method: 'GET',
      url: 'https://chainquery.lbry.io/api/sql',
      qs: { query: query },
      headers: { 'Cache-Control': 'no-cache' }
    };

    request(options, function(error, response, body) {
      if (error) return reject(error);
      if (response.statusCode !== 200 || body === null) return reject(response);
      try {
        body = JSON.parse(body);
      } catch (e) {
        return reject(e);
      }
      if (body.success === false || body.error !== null) return reject(body);
      let claimsInBlock = body.data;
      return resolve(claimsInBlock);
    });
  });
}

function discordPost(embed) {
  channels.forEach(channel => {
    discordBot.channels
      .get(channel)
      .send('', embed)
      .catch(console.error);
  });
}
