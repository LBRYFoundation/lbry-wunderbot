let needle = require('needle');
let config = require('config');
let hasHashBotChannels = require('../helpers.js').hasHashBotChannels;
let inPrivate = require('../helpers.js').inPrivate;
let ChannelID = config.get('hashbot').mainchannel;
exports.commands = [
  'hash' // command that is in this file, every command needs it own export as shown below
];

exports.custom = ['timedhash'];

exports.timedhash = function(bot) {
  setInterval(function() {
    sendMiningInfo(bot);
  }, 6 * 60 * 60 * 1000);

  function sendMiningInfo(bot) {
    needle.get('https://explorer.lbry.io/api/v1/status', function(error, response) {
      if (error || response.statusCode !== 200) {
        msg.channel.send('Explorer API is not available');
      } else {
        let data = response.body;
        let height = Number(data.status.height);
        let hashrate = data.status.hashrate;
        let difficulty = Number(data.status.difficulty);
        needle.get('https://whattomine.com/coins/164.json', function(error, response) {
          if (error || response.statusCode !== 200) {
            msg.channel.send('whattomine API is not available');
          }
          let data = response.body;
          let reward = Number(data.block_reward);
          let block_time = Number(data.block_time);
          let difficulty24 = Number(data.difficulty24);
          let description =
            'Hashrate: ' +
            numberWithCommas(hashrate) +
            '\n' +
            'Difficulty: ' +
            numberWithCommas(difficulty.toFixed(0)) +
            '\n' +
            'Difficulty 24 Hour Average: ' +
            numberWithCommas(difficulty24.toFixed(0)) +
            '\n' +
            'Current block: ' +
            numberWithCommas(height.toFixed(0)) +
            '\n' +
            'Block Time: ' +
            numberWithCommas(block_time.toFixed(0)) +
            ' seconds \n' +
            'Block Reward: ' +
            numberWithCommas(reward.toFixed(0)) +
            ' LBC \n' +
            'Sources: https://explorer.lbry.io & \n' +
            'https://whattomine.com/coins/164-lbc-lbry';
          const embed = {
            description: description,
            color: 7976557,
            author: {
              name: 'LBRY Network Stats',
              icon_url: 'https://i.imgur.com/yWf5USu.png'
            }
          };
          bot.channels.get(ChannelID).send({ embed });
          return;
        });
      }
    });
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
};

exports.hash = {
  usage: '',
  description: 'Displays current Hashrate of Network\n**!hash power <Mh/s>**\n  Displays potential Earnings For Given Hashrate',
  process: function(bot, msg, suffix) {
    let command = '!hash';
    let words = suffix
      .trim()
      .split(' ')
      .filter(function(n) {
        return n !== '';
      });
    let profitcommand = words[0];
    let myhashrate = words[1];
    if (profitcommand == 'power') {
      sendProfitInfo(bot, msg, suffix);
      return;
    } else {
      sendMiningInfo(bot, msg, suffix);
      return;
    }

    function sendMiningInfo(bot, msg, suffix) {
      if (!inPrivate(msg) && !hasHashBotChannels(msg)) {
        msg.channel.send('Please use <#' + ChannelID + '> or DMs to talk to hash bot.');
        return;
      }
      needle.get('https://explorer.lbry.io/api/v1/status', function(error, response) {
        if (error || response.statusCode !== 200) {
          msg.channel.send('Explorer API is not available');
        } else {
          let data = response.body;
          let height = Number(data.status.height);
          let hashrate = data.status.hashrate;
          let difficulty = Number(data.status.difficulty);
          needle.get('https://whattomine.com/coins/164.json', function(error, response) {
            if (error || response.statusCode !== 200) {
              msg.channel.send('whattomine API is not available');
            }
            let data = response.body;
            let reward = Number(data.block_reward);
            let block_time = Number(data.block_time);
            let difficulty24 = Number(data.difficulty24);
            let description =
              'Hashrate: ' +
              numberWithCommas(hashrate) +
              '\n' +
              'Difficulty: ' +
              numberWithCommas(difficulty.toFixed(0)) +
              '\n' +
              'Difficulty 24 Hour Average: ' +
              numberWithCommas(difficulty24.toFixed(0)) +
              '\n' +
              'Current block: ' +
              numberWithCommas(height.toFixed(0)) +
              '\n' +
              'Block Time: ' +
              numberWithCommas(block_time.toFixed(0)) +
              ' seconds \n' +
              'Block Reward: ' +
              numberWithCommas(reward.toFixed(0)) +
              ' LBC \n' +
              'Sources: https://explorer.lbry.io & \n' +
              'https://whattomine.com/coins/164-lbc-lbry';
            const embed = {
              description: description,
              color: 7976557,
              author: {
                name: 'LBRY Network Stats',
                icon_url: 'https://i.imgur.com/yWf5USu.png'
              }
            };
            msg.channel.send({ embed });
            return;
          });
        }
      });
    }
    function sendProfitInfo(bot, msg, suffix) {
      needle.get('https://whattomine.com/coins/164.json', function(error, response) {
        if (error || response.statusCode !== 200) {
          msg.channel.send('whattomine API is not available');
        } else {
          words = suffix
            .trim()
            .split(' ')
            .filter(function(n) {
              return n !== '';
            });
          let myhashrate = words[1];
          if (myhashrate == '' || myhashrate == null || myhashrate == undefined || myhashrate == ' ') {
            myhashrate = '100';
          }
          let Diff = response.body.difficulty24;
          let Reward = response.body.block_reward;
          let myHash = Number(myhashrate);
          let LBC = myHash / 2000 * (1 / ((Diff * 2) ^ 32) * Reward) * 3600;
          let LBC24 = myHash / 2000 * (1 / ((Diff * 2) ^ 32) * Reward) * 86400;
          let LBC1w = myHash / 2000 * (1 / ((Diff * 2) ^ 32) * Reward) * 604800;
          let LBC1m = myHash / 2000 * (1 / ((Diff * 2) ^ 32) * Reward) * 2628000;
          let message =
            'With **' +
            myHash +
            ' Mh/s** and Average 24 hour Difficulty: **' +
            Diff.toFixed(0) +
            '**\n' +
            'You can potentially earn the following amounts of **LBC**: \n' +
            '1 Hour = **' +
            LBC.toFixed(4) +
            '** \n' +
            '1 Day = **' +
            LBC24.toFixed(2) +
            '** \n' +
            '1 Week = **' +
            LBC1w.toFixed(4) +
            '** \n' +
            '1 Month = **' +
            LBC1m.toFixed(4) +
            '** \n';
          const embed = {
            description: message,
            color: 7976557,
            author: {
              name: 'Hashing Power Calculator!',
              icon_url: 'https://i.imgur.com/nKHVQgq.png'
            }
          };
          msg.channel.send({ embed });
          return;
        }
      });
    }
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
};
