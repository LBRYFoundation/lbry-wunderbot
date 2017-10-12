var jp = require('jsonpath');
var moment = require('moment');
var numeral = require('numeral');
var request = require('request');

var options = {
    defaultCurrency: 'USD',

    // supported currencies and api steps to arrive at the final value
    currencies: {
        USD: { steps: ['LBCBTC', 'BTCUSD'], format: '$0,0.00', sign:'USD $' },
        BTC: { steps: ['LBCBTC'], format: 'BTC 0,0.00000000', sign:'BTC' },
        ETH: { steps: ['LBCETH'], format: 'ETH 0,0.00000000', sign: 'ETH' },
        GBP: { steps: ['LBCBTC', 'BTCGBP'], format: '£0,0.00', sign: '£' },
        EUR: { steps: ['LBCEUR'], format: '€0,0.00', sign: '€' },
        CAD: { steps: ['LBCBTC', 'BTCCAD'], format: '$0,0.00', sign: 'CAD $' },
        AUD: { steps: ['LBCBTC', 'BTCAUD'], format: '$0,0.00', sign: 'AUD $' },
        IDR: { steps: ['LBCBTC', 'BTCIDR'], format: 'Rp0,0.00', sign: 'Rp' }
    },

    // api steps
    api: {
        LBCBTC: { url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LBC', path: '$.result.Bid' },
        BTCUSD: { url: 'https://blockchain.info/ticker', path: '$.USD.buy' },
        BTCGBP: { url: 'https://blockchain.info/ticker', path: '$.GBP.buy' },
        LBCETH: { url: 'https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=eth', path: '$[0].price_eth' },
        LBCEUR: { url: 'https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=eur', path: '$[0].price_eur' },
        BTCAUD: { url: 'https://blockchain.info/ticker', path: '$.AUD.buy' },
        BTCCAD: { url: 'https://blockchain.info/ticker', path: '$.CAD.buy' },
        BTCIDR: { url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=IDR', path: '$.IDR'}
    },

    // display date/time format
    dtFormat: 'Do MMM YYYY h:mma [UTC]',

    // refresh rate in milliseconds to retrieve a new price (default to 10 minutes)
    refreshTime: 300000
};

// store the last retrieved rate
var cachedRates = {};

var mktChannel;

// !price {currency}
// !price {currency} {amount}
var command = '!stats';

module.exports={
  command: command,
  init: init,
  respond: respond
};

function init(channel_) {
  mktChannel = channel_;
  if (!channel_) {
    console.log('No market and trading channel. Statbot will only respond to DMs.');
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

  if (words[0] !== command || (channel != mktChannel && !channel.startsWith('D'))) {
    // if the received message isn't starting with the trigger,
    // or the channel is not the market-and-trading channel, nor sandbox, nor a DM -> ignore
    return;
  }

  var currency = /*(words.length > 1) ? words[2].toUpperCase() :*/  options.defaultCurrency;
  var amount = /*(words.length > 2) ? parseFloat(words[2], 10) :*/ 1;
  var showHelp = (isNaN(amount)) || (Object.keys(options.currencies).indexOf(currency) === -1);

  var moveToBotSandbox = showHelp && channel !== mktChannel && !channel.startsWith("D");
  if (moveToBotSandbox) {
    bot.postMessage(channel, 'Please use PM to talk to bot.', globalSlackParams);
    return;
  }

  if (showHelp) {
    doHelp(bot, channel);
  } else {

    doSteps(bot, channel, 'USD', amount);
    doSteps(bot, channel, 'EUR', amount);
    doSteps(bot, channel, 'GBP', amount);
    doSteps(bot, channel, 'ETH', amount);
    doSteps(bot, channel, 'BTC', amount);
    doSteps(bot, channel, 'CAD', amount);
    doSteps(bot, channel, 'AUD', amount);
    doSteps(bot, channel, 'IDR', amount);
    setTimeout(function() { marketstats(bot,channel); }, 250);
    //marketstats(bot,channel);
    //volume24(bot,channel); can't get this part to work, someone help me fix - i think it's because 24h_volume_usd starts with number
  }
}

function doHelp(bot, channel) {
  var message =
    '`' + command + '`: show the price of 1 LBC in ' + options.defaultCurrency + '\n' +
    '`' + command + ' help`: this message\n' +
    '`' + command + ' CURRENCY`: show the price of 1 LBC in CURRENCY. Supported values for CURRENCY are *btc* and *usd* (case-insensitive)\n' +
    '`' + command + ' CURRENCY AMOUNT`: show the price of AMOUNT LBC in CURRENCY\n';

    if (!channel.startsWith("D")) {
      message =
        '*USE PM FOR HELP*\n' +
        message +
        '\n' +
        '*Everyone will see what I say. Send me a Direct Message if you want to interact privately.*\n' +
        'If I\'m not responding in some channel, you can invite me by @mentioning me.\n';
    }

  bot.postMessage(channel, message, globalSlackParams);
}

function formatMessage(amount, rate, option) {
    var cur = option.sign;
    var value = rate.rate * amount;
    if (option.sign == '$' || option.sign == '£' || option.sign == '€'|| option.sign == 'Rp'){
      return '*' + numeral(amount).format('0,0[.][00000000]') + ' LBC = ' + cur +' '+ value.toFixed(2) + '*';
    }
    else {
      return '*' + numeral(amount).format('0,0[.][00000000]') + ' LBC = ' + numeral(value).format('0,0[.][00000000]') + ' ' + cur + '*';
    }
}

function formaty(n, decimals, currency) {
  n = parseFloat(n);
    return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

function doSteps(bot, channel, currency, amount) {

    var option = options.currencies[currency];
    var shouldReload = true;
    if (cachedRates[currency]) {
        var cache = cachedRates[currency];
        shouldReload = cache.time === null || moment().diff(cache.time) >= options.refreshTime;
        if (!shouldReload) {
            var message = formatMessage(amount, cache, option);
            bot.postMessage(channel, message, {icon_emoji: ':lbr:'});
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

function marketstats(bot,channel) {
        var statsurl='https://api.coinmarketcap.com/v1/ticker/library-credit/';

        request.get(statsurl, function(error, response, body) {
            if (error) {
                bot.postMessage(channel, err.message ? err.message : 'The request could not be completed at this time. Please try again later.');
                return;
            }
            var marketcap = 0;
            try {
                marketcap = jp.query(JSON.parse(body), '$[0].market_cap_usd');
                if (Array.isArray(marketcap) && marketcap.length > 0) {
                    marketcap = marketcap[0];
                    marketcap = formaty(marketcap,2,'$')
                }

            } catch (ignored) {
                // invalid response or pair rate
            }

            var statmsg = '*'+'Marketcap: '+marketcap+'*\n';

                bot.postMessage(channel, statmsg, {icon_emoji: ':lbr:'});
  
        });
}

function volume24(bot,channel) {
        var statsurl='https://api.coinmarketcap.com/v1/ticker/library-credit/';

        request.get(statsurl, function(error, response, body) {
            if (error) {
                bot.postMessage(channel, err.message ? err.message : 'The request could not be completed at this time. Please try again later.');
                return;
            }
            var volume24 = 0;
            try {
                volume24 = jp.query(JSON.parse(body),'$[0].24h_volume_usd');
                if (Array.isArray(volume24) && volume24.length > 0) {
                    volume24 = volume24[0];
                }

            } catch (ignored) {
                // invalid response or pair rate
            }

            var statmsg = '*'+'Volume: $'+volume24+'*\n';

                bot.postMessage(channel, statmsg, {icon_emoji: ':lbr:'});
  
        });
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

                bot.postMessage(channel, formatMessage(amount, result, option), {icon_emoji: ':bulb:'});
            } else {
                bot.postMessage(channel, 'The rate returned for the ' + pairName + ' pair was invalid.');
            }
        });
    }
}
