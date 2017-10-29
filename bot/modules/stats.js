var jp = require('jsonpath');
var moment = require('moment');
var numeral = require('numeral');
var request = require('request');
var ChannelID = "363050205043621908"
exports.commands = [
	"stats" // command that is in this file, every command needs it own export as shown below
]

exports.stats = {
	usage: "",
	description: 'Displays current a list of current Market stats',
	process: function(bot,msg,suffix){
      var options = {
    defaultCurrency: 'USD',

    // supported currencies and api steps to arrive at the final value
    currencies: {
        USD: { steps: ['LBCUSD'], format: '$0,0.00', sign:'USD $' },
        BTC: { steps: ['LBCBTC'], format: 'BTC 0,0.00000000', sign:'BTC' },
        ETH: { steps: ['LBCETH'], format: 'ETH 0,0.00000000', sign: 'ETH' },
        GBP: { steps: ['LBCGBP'], format: '£0,0.00', sign: '£' },
        EUR: { steps: ['LBCEUR'], format: '€0,0.00', sign: '€' },
        CAD: { steps: ['LBCCAD'], format: '$0,0.00', sign: 'CAD $' },
        AUD: { steps: ['LBCAUD'], format: '$0,0.00', sign: 'AUD $' },
        IDR: { steps: ['LBCIDR'], format: 'Rp0,0.00', sign: 'Rp' }
    },

    // api steps
    api: {
        LBCBTC: { url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LBC', path: '$.result.Bid' },
        LBCUSD: { url: 'https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=usd', path: '$[0].price_usd' },
        LBCGBP: { url: 'https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=gbp', path: '$[0].price_gbp' },
        LBCETH: { url: 'https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=eth', path: '$[0].price_eth' },
        LBCEUR: { url: 'https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=eur', path: '$[0].price_eur' },
        LBCAUD: { url: 'https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=aud', path: '$[0].price_aud' },
        LBCCAD: { url: 'https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=cad', path: '$[0].price_cad' },
        LBCIDR: { url: 'https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=idr', path: '$[0].price_idr'}
    },

    // display date/time format
    dtFormat: 'Do MMM YYYY h:mma [UTC]',

    // refresh rate in milliseconds to retrieve a new price (default to 10 minutes)
    refreshTime: 300000
};

// store the last retrieved rate
var command = '!stats';

  var currency = options.defaultCurrency;
  var amount = 1;
if(!inPrivateOrBotSandbox(msg)){
    msg.channel.send('Please use <#' + ChannelID + '> or DMs to talk to stats bot.');
    return;
  } else {
    doSteps(bot, msg, 'USD', amount);
    doSteps(bot, msg, 'EUR', amount);
    doSteps(bot, msg, 'GBP', amount);
    doSteps(bot, msg, 'ETH', amount);
    doSteps(bot, msg, 'BTC', amount);
    doSteps(bot, msg, 'CAD', amount);
    doSteps(bot, msg, 'AUD', amount);
    doSteps(bot, msg, 'IDR', amount);
    setTimeout(function() { marketstats(bot,msg,suffix); }, 250);
    //marketstats(bot,msg);
    //volume24(bot,msg); can't get this part to work, someone help me fix - i think it's because 24h_volume_usd starts with number
  }
	
function formatMessage(amount, rate, option) {
    var cur = option.sign;
    var value = rate.rate * amount;
    if (option.sign == 'USD $' || option.sign == 'CAD $' || option.sign == 'AUD $' || option.sign == '£' || option.sign == '€'|| option.sign == 'Rp'){
      return '*' + numeral(amount).format('0,0[.][00000000]') + ' LBC = ' + cur +' '+ value.toFixed(2) + '*';
    }
    else {
      return '*' + numeral(amount).format('0,0[.][00000000]') + ' LBC = ' + cur +' ' + numeral(value).format('0,0[.][00000000]') + '*';
    }
}

function formaty(n, decimals, currency) {
  n = parseFloat(n);
    return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

function doSteps(bot, msg, currency, amount) {

    var option = options.currencies[currency];
        // copy the steps array
        var steps = [];
        for (var i = 0; i < option.steps.length; i++) {
            steps.push(option.steps[i]);
        }

        processSteps(bot, msg, currency, 0, amount, steps, option);
}

function marketstats(bot,msg,suffix) {
        var statsurl='https://api.coinmarketcap.com/v1/ticker/library-credit/';

        request.get(statsurl, function(error, response, body) {
            if (error) {
                msg.channel.send(err.message ? err.message : 'The request could not be completed at this time. Please try again later.');
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

                msg.channel.send(statmsg);
  
        });
}

function volume24(bot,msg,suffix) {
        var statsurl='https://api.coinmarketcap.com/v1/ticker/library-credit/';

        request.get(statsurl, function(error, response, body) {
            if (error) {
                msg.channel.send(err.message ? err.message : 'The request could not be completed at this time. Please try again later.');
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

                msg.channel.send(statmsg);
  
        });
}

function processSteps(bot, msg, currency, rate, amount, steps, option) {
    if (steps.length > 0) {
        var pairName = steps[0];
        if (!options.api[pairName]) {
            msg.channel.send('There was a configuration error. ' + pairName + ' pair was not found.');
            return;
        }

        var pair = options.api[pairName];
        request.get(pair.url, function(error, response, body) {
            if (error) {
                msg.channel.send(err.message ? err.message : 'The request could not be completed at this time. Please try again later.');
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

                msg.channel.send(formatMessage(amount, result, option));
            } else {
                msg.channel.send('The rate returned for the ' + pairName + ' pair was invalid.');
            }
        });
    }
}

function inPrivateOrBotSandbox(msg){
  if((msg.channel.type == 'dm') || (msg.channel.id === ChannelID)){
    return true;
  }else{
    return false;
  }
}
  
    }
}
