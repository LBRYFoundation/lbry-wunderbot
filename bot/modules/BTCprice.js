'use strict';
let jp = require('jsonpath');
let moment = require('moment');
let numeral = require('numeral');
let request = require('request');
let config = require('config');
let hasPriceBotChannels = require('../helpers.js').hasPriceBotChannels;
let inPrivate = require('../helpers.js').inPrivate;
let ChannelID = config.get('pricebot').mainchannel;


exports.commands = [
	"btc"
]

exports.btc = {
	usage: "<currency> <amount>",
	description: 'displays price of BTC(default 1BTC)',
	process: function(bot,msg,suffix){
		
		var options = {
    defaultCurrency: 'USD',

    // supported currencies and api steps to arrive at the final value
    currencies: {
        USD: { steps: ['BTCUSD'], format: '$0,0.00', sign: 'USD ' },
        GBP: { steps: ['BTCGBP'], format: '£0,0.00', sign: '£' },
        AUD: { steps: ['BTCAUD'], format: '$0,0.00', sign: 'AUD ' },
        BRL: { steps: ['BTCBRL'], format: 'R$0,0.00', sign: 'R$' },
        CAD: { steps: ['BTCCAD'], format: '$0,0.00', sign: 'CAD ' },
        CHF: { steps: ['BTCCHF'], format: 'CHF 0,0.00', sign: 'CHF' },
        CLP: { steps: ['BTCCLP'], format: '$0,0.00', sign: 'CLP ' },
        CNY: { steps: ['BTCCNY'], format: '¥0,0.00', sign: '¥' },
        DKK: { steps: ['BTCDKK'], format: 'kr 0,0.00', sign: 'kr' },
        EUR: { steps: ['BTCEUR'], format: '€0,0.00', sign: '€' },
        HKD: { steps: ['BTCHKD'], format: '$0,0.00', sign: 'HKD ' },
        INR: { steps: ['BTCINR'], format: '₹0,0.00', sign: '₹' },
        ISK: { steps: ['BTCISK'], format: 'kr 0,0.00', sign: 'kr' },
        JPY: { steps: ['BTCJPY'], format: '¥0,0.00', sign: '¥' },
        KRW: { steps: ['BTCKRW'], format: '₩0,0.00', sign: '₩' },
        NZD: { steps: ['BTCNZD'], format: '$0,0.00', sign: 'NZD ' },
        PLN: { steps: ['BTCPLN'], format: 'zł 0,0.00', sign: 'zł' },
        RUB: { steps: ['BTCRUB'], format: 'RUB 0,0.00', sign: 'RUB' },
        SEK: { steps: ['BTCSEK'], format: 'kr 0,0.00', sign: 'kr' },
        SGD: { steps: ['BTCSGD'], format: '$0,0.00', sign: 'SGD ' },
        THB: { steps: ['BTCTHB'], format: '฿0,0.00', sign: '฿' },
        TWD: { steps: ['BTCTWD'], format: 'NT$0,0.00', sign: 'NT$' },
        IDR: { steps: ['BTCIDR'], format: 'Rp0,0.00', sign: 'Rp' }
    },

    // api steps
    api: {
        BTCUSD: { url: 'https://blockchain.info/ticker', path: '$.USD.buy' },
        BTCGBP: { url: 'https://blockchain.info/ticker', path: '$.GBP.buy' },
        BTCAUD: { url: 'https://blockchain.info/ticker', path: '$.AUD.buy' },
        BTCBRL: { url: 'https://blockchain.info/ticker', path: '$.BRL.buy' },
        BTCCAD: { url: 'https://blockchain.info/ticker', path: '$.CAD.buy' },
        BTCCHF: { url: 'https://blockchain.info/ticker', path: '$.CHF.buy' },
        BTCCLP: { url: 'https://blockchain.info/ticker', path: '$.CLP.buy' },
        BTCCNY: { url: 'https://blockchain.info/ticker', path: '$.CNY.buy' },
        BTCDKK: { url: 'https://blockchain.info/ticker', path: '$.DKK.buy' },
        BTCEUR: { url: 'https://blockchain.info/ticker', path: '$.EUR.buy' },
        BTCHKD: { url: 'https://blockchain.info/ticker', path: '$.HKD.buy' },
        BTCINR: { url: 'https://blockchain.info/ticker', path: '$.INR.buy' },
        BTCISK: { url: 'https://blockchain.info/ticker', path: '$.ISK.buy' },
        BTCJPY: { url: 'https://blockchain.info/ticker', path: '$.JPY.buy' },
        BTCKRW: { url: 'https://blockchain.info/ticker', path: '$.KRW.buy' },
        BTCNZD: { url: 'https://blockchain.info/ticker', path: '$.NZD.buy' },
        BTCPLN: { url: 'https://blockchain.info/ticker', path: '$.PLN.buy' },
        BTCRUB: { url: 'https://blockchain.info/ticker', path: '$.RUB.buy' },
        BTCSEK: { url: 'https://blockchain.info/ticker', path: '$.SEK.buy' },
        BTCSGD: { url: 'https://blockchain.info/ticker', path: '$.SGD.buy' },
        BTCTHB: { url: 'https://blockchain.info/ticker', path: '$.THB.buy' },
        BTCTWD: { url: 'https://blockchain.info/ticker', path: '$.TWD.buy' },
        BTCIDR: { url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=IDR', path: '$.IDR'}
    },

    // display date/time format
    dtFormat: 'Do MMM YYYY h:mma [UTC]',

    // refresh rate in milliseconds to retrieve a new price (default to 10 minutes)
    refreshTime: 100000
};
    var words = suffix.trim().split(' ').filter( function(n){return n !== "";} );

  var currency = (words.length > 0) ? words[0].toUpperCase() : options.defaultCurrency;
  var amount = (words.length > 1) ? parseFloat(words[1], 10) : 1;
  var showHelp = (isNaN(amount)) || (Object.keys(options.currencies).indexOf(currency) === -1);
// store the last retrieved rate
var cachedRates = {};
var command = "!btc"

  var currencies = Object.keys(options.currencies);
  for (var i = 0; i < currencies.length; i++) {
    cachedRates[currencies[i]] = { rate: 0, time: null };
  }
  if (showHelp) {
    doHelp(bot,msg,suffix);
  } else {
	  if(!hasPriceBotChannels(msg) && !inPrivate(msg)){
    msg.channel.send('Please use <#' + ChannelID + '> or DMs to talk to price bot.');
    return;
  }
    doSteps(bot, currency, amount);
  }

function doHelp(bot,msg,suffix) {
	if(!hasPriceBotChannels(msg) && !inPrivate(msg)){
    msg.channel.send('Please use <#' + ChannelID + '> or DMs to talk to price bot.');
    return;
  }
  var message =
    '**' + command + '**: show the price of 1 BTC in ' + options.defaultCurrency + '\n' +
    '**' + command + ' help**: this message\n' +
    '**' + command + ' CURRENCY**: show the price of 1 BTC in CURRENCY. Supported values for CURRENCY are Listed Below\n' +
    '**' + command + ' CURRENCY AMOUNT**: show the price of AMOUNT BTC in CURRENCY\n' +
    '**Supported Currencies:** *usd*, *gbp*, *eur*, *aud*, *brl*, *cad*, *chf*, *clp*, *cny*, *dkk*, *hkd*, *inr*, *isk*, *jpy*, *krw*, *nzd*, *pln* ,*rub*, *sek*, *sgd*, *thb*, *twd*, *idr* and *btc* (case-insensitive)';
  msg.channel.send(message);
}

function formatMessage(amount, rate, option) {
	var cur = option.sign;
    var value = numeral(rate.rate * amount).format(option.format);
		return '*' + numeral(amount).format('0,0[.][00000000]') + ' BTC = ' + cur +' ' + value + '*\n_last updated ' + rate.time.utc().format(options.dtFormat) + '_';
}

function doSteps(bot, currency, amount) {
    var option = options.currencies[currency];
    var shouldReload = true;
    if (cachedRates[currency]) {
        var cache = cachedRates[currency];
        shouldReload = cache.time === null || moment().diff(cache.time) >= options.refreshTime;
        if (!shouldReload) {
            var message = formatMessage(amount, cache, option);
            msg.channel.send(message);
        }
    }

    if (shouldReload) {
        // copy the steps array
        var steps = [];
        for (var i = 0; i < option.steps.length; i++) {
            steps.push(option.steps[i]);
        }

        processSteps(bot, currency, 0, amount, steps, option);
    }
}

function processSteps(bot, currency, rate, amount, steps, option) {
    if (steps.length > 0) {
        var pairName = steps[0];
        if (!options.api[pairName]) {
            msg.channel.send('There was a configuration error. ' + pairName + ' pair was not found.');
            return;
        }

        var pair = options.api[pairName];
        request.get(pair.url, function(error, response, body) {
            if (error) {
                msg.channel.send( err.message ? err.message : 'The request could not be completed at this time. Please try again later.');
                return;
            }
            var pairRate = 0;
            try {
                pairRate = jp.query(JSON.parse(body), pair.path);
                if (Array.isArray(pairRate) && pairRate.length > 0) {
                    pairRate = pairRate[0];
                }
            } catch (ignored) {
                // invalid response or pair rate
            }

            if (pairRate > 0) {
                rate = (rate === 0) ? pairRate : rate * pairRate;
                steps.shift();
                if (steps.length > 0) {
                    processSteps(bot, currency, rate, amount, steps, option);
                    return;
                }

                // final step, cache and then response
                var result = { rate: rate, time: moment() };
                cachedRates[currency] = result;
                msg.channel.send(formatMessage(amount, result, option));
            } else {
                msg.channel.send('The rate returned for the ' + pairName + ' pair was invalid.');
            }
        });
    }
}

}
}