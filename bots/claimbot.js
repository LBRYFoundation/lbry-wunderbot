'use strict';

var lbry;
var mongo;
var slackbot;
var channel;
var moment = require('moment');
var request = require('request');
var sleep = require('sleep');

module.exports = {
  init: init,
};


function init(slackbot_, channel_, rpcuser, rpcpassword, mongodburl) {
  if (lbry) {
    throw new Error('init was already called once');
  }

  slackbot = slackbot_;

  channel = channel_;
  if (!channel_) {
    console.log('No claims channel, disabling claimbot');
    return;
  }

  const MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(mongodburl, function (err, db) {
    if (err) {
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

    console.log('Activating claimbot');

    setInterval(function () {
      announceNewClaims();
    }, 60 * 1000);
    announceNewClaims();
  });
}

function announceNewClaims() {

  if (!mongo) {
    slackPost('Failed to connect to mongo', { icon_emoji: ':exclamation:' });
    return;
  }

  if (!lbry) {
    slackPost('Failed to connect to lbrycrd', { icon_emoji: ':exclamation:' });
    return;
  }

  Promise.all([getLastBlock(), lbryCall('getinfo')])
    .then(function ([lastProcessedBlock, currentBlockInfo]) {
      const currentHeight = currentBlockInfo['blocks'];

      // console.log('Checking for new blocks');

      if (lastProcessedBlock === null) {
        console.log('First run. Setting last processed block to ' + currentHeight + ' and exiting.');
        return setLastBlock(currentHeight);
      }

      const testBlock = false;

      if (testBlock || lastProcessedBlock < currentHeight) {
        const firstBlockToProcess = testBlock || lastProcessedBlock + 1,
          lastBlockToProcess = testBlock || currentHeight;

        // console.log('Doing blocks ' + firstBlockToProcess + ' to ' + lastBlockToProcess);
        return announceClaimsLoop(firstBlockToProcess, lastBlockToProcess, currentHeight);

      }
    })
    .catch(function (err) {
      slackPost(err.stack, { icon_emoji: ':exclamation:' });
    });
}

function announceClaimsLoop(block, lastBlock, currentHeight) {
  // console.log('Doing block ' + block)
  let claimsFound = 0;
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
      claimsFound = claims.length;
      return Promise.all(claims.map(function (claim) {
        //slack has a rate limit. to avoid hitting it we must have a small delay between each message
        //if claims were found in this block, then we wait, otherwise we don't
        if (claimsFound > 0)
          sleep.msleep(300);
        return announceClaim(claim, block, currentHeight);
      }));
    })
    .then(function () {
      return setLastBlock(block);
    })
    .then(function () {
      const nextBlock = block + 1;
      if (nextBlock <= lastBlock) {
        return announceClaimsLoop(nextBlock, lastBlock, currentHeight);
      }
    });
}

function announceClaim(claim, claimBlockHeight, currentHeight) {
  //console.log(claim);
  console.log('' + claimBlockHeight + ': New claim for ' + claim['name']);
  var options = {
    method: 'GET',
    url: 'https://explorer.lbry.io/api/getclaimbyid/' + claim['claimId']
    //url: 'http://127.0.0.1:5000/claim_decode/' + claim['name']
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    try {
      console.log(body);

      let claimData = null;
      let channelName = null;
      try {
        body = JSON.parse(body);
        if (body.hasOwnProperty('value') && body.value.hasOwnProperty('stream') && body.value.stream.hasOwnProperty('metadata')) {
          claimData = body.value.stream.metadata;
          channelName = (body.hasOwnProperty('channel_name') ? body['channel_name'] : null);
        }
      }
      catch (e) {
        console.error(e);
      }

      return Promise.all([
        lbryCall('getvalueforname', claim['name']),
        lbryCall('getclaimsforname', claim['name']),
      ])
        .then(function([currentWinningClaim, claimsForName]) {
          //console.log(JSON.stringify(claimData));
          let value = null;
          if (claimData !== null)
            value = claimData;
          else {
            try {
              value = JSON.parse(claim['value']);
            } catch (e) { }
          }

          const text = [];

          if (value) {
            if (channelName) {
              text.push("Channel: lbry://" + channelName);
            }
            else if (value['author']) {
              text.push("author: " + value['author']);
            }
            if (value['description']) {
              text.push(value['description']);
            }
            // if (value['content_type'])
            // {
            //   text.push("*Content Type:* " + value['content_type']);
            // }
            if (value['nsfw']) {
              text.push("*Warning: Adult Content*");
            }

            //"fee":{"currency":"LBC","amount":186,"version":"_0_0_1","address":"bTGoFCakvQXvBrJg1b7FJzombFUu6iRJsk"}
            if (value['fee']) {
              const fees = [];
              text.push("Price: " + value['fee'].amount + " *" + value['fee'].currency + '*');
              /*for (var key in value['fee']) {
                fees.push(value['fee'][key]['amount'] + ' ' + key);
              }
              text.push(fees.join(', '));*/
            }
          }

          if (!claim['is controlling']) {
            // the following is based on https://lbry.io/faq/claimtrie-implementation
            const lastTakeoverHeight = claimsForName['nLastTakeoverHeight'],
              maxDelay = 4032, // 7 days of blocks at 2.5min per block
              activationDelay = Math.min(maxDelay, Math.floor((claimBlockHeight - lastTakeoverHeight) / 32)),
              takeoverHeight = claimBlockHeight + activationDelay,
              secondsPerBlock = 161, // in theory this should be 150, but in practice its closer to 161
              takeoverTime = Date.now() + ((takeoverHeight - currentHeight) * secondsPerBlock * 1000);

            text.push('Takes effect on approx. *' + moment(takeoverTime, 'x').format('MMMM Do [at] HH:mm [UTC]') + '* (block ' + takeoverHeight + ')');
          }

          const attachment = {
            "fallback": "New claim for lbry://" + claim['name'],
            "color": "#155b4a",
            // "pretext": "New claim in block " + claimBlockHeight,
            // "author_name": 'lbry://' + claim['name'],
            // "author_link": 'lbry://' + claim['name'],
            // "author_icon": "http://flickr.com/icons/bobby.jpg",
            "title": "lbry://" + (channelName ? channelName + '/' : '') + claim['name'], //escapeSlackHtml(value['title']),
            "title_link": "lbry://" + (channelName ? channelName + '/' : '') + claim['name'],
            "text": escapeSlackHtml(text.join("\n")),
            // "fields": [],
            // "image_url": value['nsfw'] ? null : value['thumbnail'],
            // "thumb_url": (!value || value['nsfw']) ? null : value['thumbnail'],
            "unfurl_links": false,
            "unfurl_media": false,
            "link_names": false,
            "parse": "none",
            "footer": "Block " + claimBlockHeight + " • Claim ID " + claim['claimId'],
            "mrkdwn_in": ['text'],
          };

          if (value) {
            attachment['fallback'] += (': "' + value['title'] + '" by ' + value['author']);
            attachment['author_name'] = 'lbry://' + (channelName ? channelName + '/' : '') + claim['name'];
            attachment['author_link'] = 'lbry://' + (channelName ? channelName + '/' : '') + claim['name'];
            attachment['title'] = escapeSlackHtml(value['title']);
            if (!value['nsfw']) {
              attachment['thumb_url'] = value['thumbnail'];
            }
          }

          slackPost('', { icon_emoji: ':bellhop_bell:', attachments: [attachment] });
        });
    }
    catch (e) {
      console.error(e);
    }
  });
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
      if (err) {
        reject(err);
      }
      else if (!obj) {
        mongo.collection('claimbot').createIndex({ 'last_block': 1 }, { unique: true });
        resolve(null);
      }
      else {
        resolve(obj.last_block);
      }
    });
  });
}

function setLastBlock(block) {
  return new Promise(function (resolve, reject) {
    mongo.collection('claimbot').findOneAndUpdate(
      { 'last_block': { '$exists': true } },
      { 'last_block': block },
      { 'upsert': true, 'returnOriginal': false },
      function (err, obj) {
        if (!err && obj && obj.value.last_block != block) {
          reject('Last value should be ' + block + ', but it is ' + obj.value.last_block);
        }
        else {
          resolve();
        }
      }
    );
  });
}

function slackPost(text, params) {
  slackbot.postMessage(channel, text, params).fail(function (value) {
    console.log('FAILED TO SLACK to ' + channel + '. Text: "' + text + '". Params: ' + JSON.stringify(params) + "\nResponse: " + JSON.stringify(value));
  });
}

function lbryCall(...args) {
  return new Promise(function (resolve, reject) {
    lbry.cmd(...args, function (err, ...response) {
      if (err) {
        reject(new Error('JSONRPC call failed. Args: [' + args.join(', ') + ']'));
      }
      else {
        resolve(...response);
      }
    });
  });
}