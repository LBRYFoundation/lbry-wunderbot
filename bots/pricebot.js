var jp = require('jsonpath');
var moment = require('moment');
var numeral = require('numeral');
var request = require('request');
var options = {
    defaultCurrency: 'USD',

    // supported currencies and api steps to arrive at the final value
    currencies: {
        USD: { steps: ['LBCBTC', 'BTCUSD'], format: '$0,0.00', sign: '$' },
        GBP: { steps: ['LBCBTC', 'BTCGBP'], format: '£0,0.00', sign: '£' },
        AUD: { steps: ['LBCBTC', 'BTCAUD'], format: '$0,0.00', sign: '$' },
        BRL: { steps: ['LBCBTC', 'BTCBRL'], format: 'R$0,0.00', sign: 'R$' },
        CAD: { steps: ['LBCBTC', 'BTCCAD'], format: '$0,0.00', sign: '$' },
        CHF: { steps: ['LBCBTC', 'BTCCHF'], format: 'CHF 0,0.00', sign: 'CHF' },
        CLP: { steps: ['LBCBTC', 'BTCCLP'], format: '$0,0.00', sign: '$' },
        CNY: { steps: ['LBCBTC', 'BTCCNY'], format: '¥0,0.00', sign: '¥' },
        DKK: { steps: ['LBCBTC', 'BTCDKK'], format: 'kr 0,0.00', sign: 'kr' },
        EUR: { steps: ['LBCBTC', 'BTCEUR'], format: '€0,0.00', sign: '€' },
        HKD: { steps: ['LBCBTC', 'BTCHKD'], format: '$0,0.00', sign: '$' },
        INR: { steps: ['LBCBTC', 'BTCINR'], format: '₹0,0.00', sign: '₹' },
        ISK: { steps: ['LBCBTC', 'BTCISK'], format: 'kr 0,0.00', sign: 'kr' },
        JPY: { steps: ['LBCBTC', 'BTCJPY'], format: '¥0,0.00', sign: '¥' },
        KRW: { steps: ['LBCBTC', 'BTCKRW'], format: '₩0,0.00', sign: '₩' },
        NZD: { steps: ['LBCBTC', 'BTCNZD'], format: '$0,0.00', sign: '$' },
        PLN: { steps: ['LBCBTC', 'BTCPLN'], format: 'zł 0,0.00', sign: 'zł' },
        RUB: { steps: ['LBCBTC', 'BTCRUB'], format: 'RUB 0,0.00', sign: 'RUB' },
        SEK: { steps: ['LBCBTC', 'BTCSEK'], format: 'kr 0,0.00', sign: 'kr' },
        SGD: { steps: ['LBCBTC', 'BTCSGD'], format: '$0,0.00', sign: '$' },
        THB: { steps: ['LBCBTC', 'BTCTHB'], format: '฿0,0.00', sign: '฿' },
        TWD: { steps: ['LBCBTC', 'BTCTWD'], format: 'NT$0,0.00', sign: 'NT$' },
        IDR: { steps: ['LBCBTC', 'BTCIDR'], format: 'Rp0,0.00', sign: 'Rp' },
        BTC: { steps: ['LBCBTC'], format: '0,0[.][00000000] BTC', sign: 'BTC' }
    },

    // api steps
    api: {
        LBCBTC: { url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LBC', path: '$.result.Bid' },
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
    refreshTime: 600000
};

// store the last retrieved rate
var cachedRates = {};

var mktChannel;

// !price {currency}
// !price {currency} {amount}
var command = '!price';

module.exports={
  command: command,
  init: init,
  respond: respond
};

function init(channel_) {
  mktChannel = channel_;
  if (!channel_) {
    console.log('No market and trading channel. Pricebot will only respond to #bot-sandbox and DMs.');
  }

  var currencies = Object.keys(options.currencies);
  for (var i = 0; i < currencies.length; i++) {
    cachedRates[currencies[i]] = { rate: 0, time: null };
  }
}

var globalSlackParams = {};

function respond(bot, data) {
  var channel = data.channel,
      words = data.text.trim().split(' ').filter( function(n){return n !== "";} );

  if (words[0] !== command || (channel != mktChannel && channel !== 'C1TEEBS2Z' && !channel.startsWith('D'))) {
    // if the received message isn't starting with the trigger,
    // or the channel is not the market-and-trading channel, nor sandbox, nor a DM -> ignore
    return;
  }

  var currency = (words.length > 1) ? words[1].toUpperCase() : options.defaultCurrency;
  var amount = (words.length > 2) ? parseFloat(words[2], 10) : 1;
  var showHelp = (isNaN(amount)) || (Object.keys(options.currencies).indexOf(currency) === -1);

  var moveToBotSandbox = showHelp && channel !== 'C1TEEBS2Z' && !channel.startsWith("D");
  if (moveToBotSandbox) {
    bot.postMessage(channel, 'Please use <#C1TEEBS2Z|bot-sandbox> to talk to bots.', globalSlackParams);
    return;
  }

  if (showHelp) {
    doHelp(bot, channel);
  } else {
    doSteps(bot, channel, currency, amount);
  }
}

function doHelp(bot, channel) {
  var message =
    '`' + command + '`: show the price of 1 LBC in ' + options.defaultCurrency + '\n' +
    '`' + command + ' help`: this message\n' +
    '`' + command + ' CURRENCY`: show the price of 1 LBC in CURRENCY. Supported values for CURRENCY are Listed Below\n' +
    '`' + command + ' CURRENCY AMOUNT`: show the price of AMOUNT LBC in CURRENCY\n' +
    '`Supported Currencies:` *usd*, *gbp*, *eur*, *aud*, *brl*, *cad*, *chf*, *clp*, *cny*, *dkk*, *hkd*, *inr*, *isk*, *jpy*, *krw*, *nzd*, *pln* ,*rub*, *sek*, *sgd*, *thb*, *twd*, *idr* and *btc* (case-insensitive)';

    if (!channel.startsWith("D")) {
      message =
        '*USE <#C1TEEBS2Z|bot-sandbox> FOR HELP*\n' +
        message +
        '\n' +
        '*Everyone will see what I say. Send me a Direct Message if you want to interact privately.*\n' +
        'If I\'m not responding in some channel, you can invite me by @mentioning me.\n';
    }

  bot.postMessage(channel, message, globalSlackParams);
}

function formatMessage(amount, rate, option) {
	var cur = option.sign;
    var value = numeral(rate.rate * amount).format(option.format);
    return '*' + numeral(amount).format('0,0[.][00000000]') + ' LBC = ' + cur +' ' + value + '*\n_last updated ' + rate.time.utc().format(options.dtFormat) + '_';
}

function doSteps(bot, channel, currency, amount) {
    var option = options.currencies[currency];
    var shouldReload = true;
    if (cachedRates[currency]) {
        var cache = cachedRates[currency];
        shouldReload = cache.time === null || moment().diff(cache.time) >= options.refreshTime;
        if (!shouldReload) {
            var message = formatMessage(amount, cache, option);
            bot.postMessage(channel, message);
        }
    }

    if (shouldReload) {
        // copy the steps array
        var steps = [];
        for (var i = 0; i < option.steps.length; i++) {
            steps.push(option.steps[i]);
        }

        processSteps(bot, channel, currency, 0, amount, steps, option);
    }
}

function processSteps(bot, channel, currency, rate, amount, steps, option) {
    if (steps.length > 0) {
        var pairName = steps[0];
        if (!options.api[pairName]) {
            bot.postMessage(channel, 'There was a configuration error. ' + pairName + ' pair was not found.');
            return;
        }

        var pair = options.api[pairName];
        request.get(pair.url, function(error, response, body) {
            if (error) {
                bot.postMessage(channel, err.message ? err.message : 'The request could not be completed at this time. Please try again later.');
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
                    processSteps(bot, channel, currency, rate, amount, steps, option);
                    return;
                }

                // final step, cache and then response
                var result = { rate: rate, time: moment() };
                cachedRates[currency] = result;
                bot.postMessage(channel, formatMessage(amount, result, option));
            } else {
                bot.postMessage(channel, 'The rate returned for the ' + pairName + ' pair was invalid.');
            }
        });
    }
}
