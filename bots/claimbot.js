'use strict';

var lbry;
var mongo;
var moment = require('moment');

module.exports = {
  init: init,
};


function init(slackbot, channel, rpcuser, rpcpassword, mongodburl) {
  if (lbry)
  {
    throw new Error('init was already called once');
  }

  if (!channel)
  {
    console.log('No claims channel, disabling claimbot');
    return;
  }

  const MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(mongodburl, function (err, db) {
    if (err)
    {
      throw err;
    }
    mongo = db;

    const bitcoin = require('bitcoin');
    lbry = new bitcoin.Client({
      host: 'localhost',
      'port': 9245,
      'user': rpcuser,
      'pass': rpcpassword
    });

    setInterval(function () {
      announceNewClaims(slackbot, channel);
    }, 60 * 1000);
    announceNewClaims(slackbot, channel);
  });
}


function announceNewClaims(slackbot, channel) {

  if (!mongo)
  {
    slackbot.postMessage(channel, 'Failed to connect to mongo', {icon_emoji: ':exclamation:'});
    return;
  }

  if (!lbry)
  {
    slackbot.postMessage(channel, 'Failed to connect to lbrycrd', {icon_emoji: ':exclamation:'});
    return;
  }

  Promise.all([getLastBlock(), lbryCall('getinfo')])
    .then(function ([lastProcessedBlock, currentBlockInfo]) {
      const currentHeight = currentBlockInfo['blocks'];

      // console.log('Checking for new blocks');

      if (lastProcessedBlock === null)
      {
        console.log('First run. Setting last processed block to ' + currentHeight + ' and exiting.');
        return setLastBlock(currentHeight);
      }

      if (lastProcessedBlock < currentHeight)
      {
        const firstBlockToProcess = lastProcessedBlock + 1,
          lastBlockToProcess = currentHeight;

        // console.log('Doing blocks ' + firstBlockToProcess + ' to ' + lastBlockToProcess);
        return announceClaimsLoop(slackbot, channel, firstBlockToProcess, lastBlockToProcess, currentHeight);

      }
    })
    .catch(function (err) {
      slackbot.postMessage(channel, err.stack, {icon_emoji: ':exclamation:'});
    });
}

function announceClaimsLoop(slackbot, channel, block, lastBlock, currentHeight) {
  // console.log('Doing block ' + block)
  return lbryCall('getblockhash', block)
    .then(function (blockHash) {
      return lbryCall('getblock', blockHash);
    })
    .then(function (blockData) {
      return Promise.all(blockData['tx'].map(getClaimsForTxid))
    })
    .then(function (arrayOfClaimArrays) {
      const claims = Array.prototype.concat(...arrayOfClaimArrays).filter(function (c) {
        return !!c;
      });
      console.log('Found ' + claims.length + ' claims in ' + block);
      return Promise.all(claims.map(function (claim) {
        return announceClaim(claim, block, currentHeight, slackbot, channel);
      }));
    })
    .then(function () {
      return setLastBlock(block);
    })
    .then(function () {
      const nextBlock = block + 1;
      if (nextBlock <= lastBlock)
      {
        return announceClaimsLoop(slackbot, channel, nextBlock, lastBlock, currentHeight);
      }
    });
}

function announceClaim(claim, claimBlockHeight, currentHeight, slackbot, channel) {
  console.log('' + claimBlockHeight + ': New claim for ' + claim['name']);
  return Promise.all([
    lbryCall('getvalueforname', claim['name']),
    lbryCall('getclaimsforname', claim['name']),
  ])
    .then(function ([currentWinningClaim, claimsForName]) {
      let value;
      try
      {
        value = JSON.parse(claim['value']);
      }
      catch (e)
      {
      }

      // console.log(claim);
      // console.log(value);

      const text = [];

      if (value['author'])
      {
        text.push(value['author']);
      }
      if (value['description'])
      {
        text.push(value['description']);
      }
      // if (value['content_type'])
      // {
      //   text.push("*Content Type:* " + value['content_type']);
      // }
      if (value['nsfw'])
      {
        text.push("*Warning: Adult Content*");
      }
      if (value['fee'])
      {
        const fees = [];
        for (var key in value['fee'])
        {
          fees.push(value['fee'][key]['amount'] + ' ' + key);
        }
        text.push(fees.join(', '));
      }

      const fields = [];
      if (!claim['is controlling'])
      {
        // the following is based on https://lbry.io/faq/claimtrie-implementation
        const lastTakeoverHeight = claimsForName['nLastTakeoverHeight'],
          maxDelay = 4032, // 7 days of blocks at 2.5min per block
          activationDelay = Math.min(maxDelay, Math.floor((claimBlockHeight - lastTakeoverHeight) / 32)),
          takeoverHeight = claimBlockHeight + activationDelay,
          secondsPerBlock = 161, // in theory this should be 150, but in practice its closer to 161
          takeoverTime = Date.now() + ((takeoverHeight - currentHeight) * secondsPerBlock * 1000);

        text.push('Takes effect on approx. *' + moment(takeoverTime, 'x').format('MMMM Do [at] HH:mm [UTC]') + '* (block ' + takeoverHeight + ')');
      }


      const attachment = !value ? null : {
        "fallback": "New claim for lbry://" + claim['name'] + ': "' + claim['title'] + '" by ' + claim['author'],
        "color": "#155b4a",
        // "pretext": "New claim in block " + claimBlockHeight,
        "author_name": 'lbry://' + claim['name'],
        "author_link": 'lbry://' + claim['name'],
        // "author_icon": "http://flickr.com/icons/bobby.jpg",
        "title": escapeSlackHtml(value['title']),
        "title_link": "lbry://" + claim['name'],
        "text": escapeSlackHtml(text.join("\n")),
        "fields": fields,
        // "image_url": value['nsfw'] ? null : value['thumbnail'],
        "thumb_url": value['nsfw'] ? null : value['thumbnail'],
        "unfurl_links": false,
        "unfurl_media": false,
        "link_names": false,
        "parse": "none",
        "footer": "Block " + claimBlockHeight + " • Claim ID " + claim['claimId'],
        "mrkdwn_in": ['text'],
      };

      slackbot.postMessage(channel, '', {icon_emoji: ':bellhop_bell:', attachments: [attachment]});
    })
}

function escapeSlackHtml(txt) {
  return txt.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
}

function getClaimsForTxid(txid) {
  return lbryCall('getclaimsfortx', txid)
    .catch(function (err) {
      // an error here most likely means the transaction is spent,
      // which also means there are no claims worth looking at
      return [];
    });
}

function getLastBlock() {
  return new Promise(function (resolve, reject) {
    mongo.collection('claimbot').findOne({}, function (err, obj) {
      if (err)
      {
        reject(err);
      }
      else if (!obj)
      {
        mongo.collection('claimbot').createIndex({'last_block': 1}, {unique: true});
        resolve(null);
      }
      else
      {
        resolve(obj.last_block);
      }
    });
  });
}

function setLastBlock(block) {
  return new Promise(function (resolve, reject) {
    mongo.collection('claimbot').findOneAndUpdate(
      {'last_block': {'$exists': true}},
      {'last_block': block},
      {'upsert': true, 'returnOriginal': false},
      function (err, obj) {
        if (!err && obj && obj.value.last_block != block)
        {
          reject('Last value should be ' + block + ', but it is ' + obj.value.last_block);
        }
        else
        {
          resolve();
        }
      }
    );
  });
}

function lbryCall(...args) {
  return new Promise(function (resolve, reject) {
    lbry.cmd(...args, function (err, ...response) {
      if (err)
      {
        reject(new Error('JSONRPC call failed. Args: [' + args.join(', ') + ']'));
      }
      else
      {
        resolve(...response);
      }
    });
  });
}