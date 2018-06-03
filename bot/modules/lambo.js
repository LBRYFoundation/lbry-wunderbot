'use strict';
let jp = require('jsonpath');
let moment = require("moment");
let numeral = require('numeral');
let request = require('request');
let config = require('config');
let needle = require('needle');
let hasPriceBotChannels = require("../helpers.js").hasPriceBotChannels;
let inPrivate = require('../helpers.js').inPrivate;
let channelID = config.get("pricebot").mainchannel;

exports.commands = ['lambo'];

exports.lambo = {
  usage: '<amount-optional>',
  description:
    'displays amount of given alt coin to get a lambo\n    if <amount> is supplied that will be deducted from total price towards 1 Lambo!',
  process: function(bot, msg, suffix) {
    let dt = new Date();
    let timestamp = moment()
      .tz('America/Los_Angeles')
      .format('MM-DD-YYYY hh:mm a');

    if (!hasPriceBotChannels(msg) && !inPrivate(msg)) {
      msg.channel.send(
        'Please use <#' + channelID + '> or DMs to talk to price bot.'
      );
      return;
    } else {
      lamboCalc(bot, msg, suffix);
    }

    function lamboCalc(bot, msg, suffix) {
      let words = suffix
        .trim()
        .split(' ')
        .filter(function(n) {
          return n !== '';
        });
      if (!words[0]) {
        let coin = 'LBC';
      } else {
        let coin = words[0].toUpperCase();
      }
      if (!words[1]) {
        let amount = 1;
      } else {
        let amount = words[1];
      }
      needle.get('https://api.coinmarketcap.com/v2/listings/', function(error, response) {
        if (error || response.statusCode !== 200) {
                msg.channel.send(
                  'API not avaialble...'
                );
        } else {
          let JSON1 = response.body.data;
          if (
            Number(JSON1.findIndex(symbols => symbols.symbol == coin)) != -1
          ) {
            let hasMatch = true;
            let index = JSON1.findIndex(symbols => symbols.symbol == coin);
          } else {
            let hasMatch = false;
            let index = JSON1.findIndex(symbols => symbols.symbol == coin);
          }
          let coinJson = JSON1[index];
          if (!hasMatch || !coinJson) {
            msg.channel.send('Invalid Alt Coin');
            return;
          }
          let coinID = coinJson.id;
          needle.get('https://api.coinmarketcap.com/v2/ticker/' + coinID + '/?convert=USD', function(
            error,
            response
          ) {
            if (error || response.statusCode !== 200) {
                msg.channel.send(
                  'API not avaialble...'
                );
            } else {
              let rate = Number(response.body.data.quotes.USD.price);
              let cost = 250000 / rate;
              if (amount <= 1) {
                let message =
                  cost.toFixed(0) + ' ' + coin + ' = 1 Lambo Huracan';
              } else {
                let cost = cost - amount;
                let message =
                  'Need **' +
                  cost.toFixed(0) +
                  ' ' +
                  coin +
                  '** for 1 Lambo Huracan';
              }
              const embed = {
                description: message,
                color: 7976557,
                footer: {
                  text: 'Last Updated | ' + timestamp + ' PST'
                },
                author: {
                  name: coin + ' to 1 Lambo Calc'
                }
              };
              msg.channel.send({ embed });
            }
          });
        }
      });
    }
  }
};
