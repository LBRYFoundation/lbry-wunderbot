'use strict';
let jp = require('jsonpath');
let moment = require('moment');
let numeral = require('numeral');
let request = require('request');
let config = require('config');
let hasPriceBotChannels = require('../helpers.js').hasPriceBotChannels;
let inPrivate = require('../helpers.js').inPrivate;
let ChannelID = config.get('pricebot').mainchannel;

exports.commands = ['price'];

exports.price = {
  usage: '<currency> <amount>',
  description: 'displays price of lbc',
  process: function(bot, msg, suffix) {
    let options = {
      defaultCurrency: 'BTC',

      // supported currencies and api steps to arrive at the final value
      currencies: {
        USD: {
          steps: ['LBCBTC', 'BTCUSD'],
          format: '$0,0.00',
          sign: 'USD '
        },
        GBP: {
          steps: ['LBCBTC', 'BTCGBP'],
          format: '£0,0.00',
          sign: '£'
        },
        AUD: {
          steps: ['LBCBTC', 'BTCAUD'],
          format: '$0,0.00',
          sign: 'AUD '
        },
        BRL: {
          steps: ['LBCBTC', 'BTCBRL'],
          format: 'R$0,0.00',
          sign: 'R$'
        },
        CAD: {
          steps: ['LBCBTC', 'BTCCAD'],
          format: '$0,0.00',
          sign: 'CAD '
        },
        CHF: {
          steps: ['LBCBTC', 'BTCCHF'],
          format: 'CHF 0,0.00',
          sign: 'CHF'
        },
        CLP: {
          steps: ['LBCBTC', 'BTCCLP'],
          format: '$0,0.00',
          sign: 'CLP '
        },
        CNY: {
          steps: ['LBCBTC', 'BTCCNY'],
          format: '¥0,0.00',
          sign: '¥'
        },
        DKK: {
          steps: ['LBCBTC', 'BTCDKK'],
          format: 'kr 0,0.00',
          sign: 'kr'
        },
        EUR: {
          steps: ['LBCBTC', 'BTCEUR'],
          format: '€0,0.00',
          sign: '€'
        },
        HKD: {
          steps: ['LBCBTC', 'BTCHKD'],
          format: '$0,0.00',
          sign: 'HKD '
        },
        INR: {
          steps: ['LBCBTC', 'BTCINR'],
          format: '₹0,0.00',
          sign: '₹'
        },
        ISK: {
          steps: ['LBCBTC', 'BTCISK'],
          format: 'kr 0,0.00',
          sign: 'kr'
        },
        JPY: {
          steps: ['LBCBTC', 'BTCJPY'],
          format: '¥0,0.00',
          sign: '¥'
        },
        KRW: {
          steps: ['LBCBTC', 'BTCKRW'],
          format: '₩0,0.00',
          sign: '₩'
        },
        NZD: {
          steps: ['LBCBTC', 'BTCNZD'],
          format: '$0,0.00',
          sign: 'NZD '
        },
        RUB: {
          steps: ['LBCBTC', 'BTCRUB'],
          format: 'RUB 0,0.00',
          sign: 'RUB'
        },
        SEK: {
          steps: ['LBCBTC', 'BTCSEK'],
          format: 'kr 0,0.00',
          sign: 'kr'
        },
        SGD: {
          steps: ['LBCBTC', 'BTCSGD'],
          format: '$0,0.00',
          sign: 'SGD '
        },
        THB: {
          steps: ['LBCBTC', 'BTCTHB'],
          format: '฿0,0.00',
          sign: '฿'
        },
        TWD: {
          steps: ['LBCBTC', 'BTCTWD'],
          format: 'NT$0,0.00',
          sign: 'NT$'
        },
        MYR: {
          steps: ['LBCBTC', 'BTCMYR'],
          format: 'RM0,0.00',
          sign: 'RM'
        },
        IDR: {
          steps: ['LBCBTC', 'BTCIDR'],
          format: 'Rp0,0.00',
          sign: 'Rp'
        },
        VND: {
          steps: ['LBCBTC', 'BTCVND'],
          format: '₫ 0,0.00',
          sign: '₫'
        },
        PHP: {
          steps: ['LBCBTC', 'BTCPHP'],
          format: '₱ 0,0.00',
          sign: '₱'
        },
        BND: {
          steps: ['LBCBTC', 'BTCBND'],
          format: 'B$ 0,0.00',
          sign: 'B$'
        },
        SAR: {
          steps: ['LBCBTC', 'BTCSAR'],
          format: 'SR0,0.00',
          sign: 'SR'
        },
        MXN: {
          steps: ['LBCBTC', 'BTCMXN'],
          format: 'Mex$ 0,0.00',
          sign: 'Mex$'
        },
        TRY: {
          steps: ['LBCBTC', 'BTCTRY'],
          format: '₺ 0,0.00',
          sign: '₺'
        },
        MMK: {
          steps: ['LBCBTC', 'BTCMMK'],
          format: 'K 0,0.00',
          sign: 'K'
        },
        KHR: {
          steps: ['LBCBTC', 'BTCKHR'],
          format: '៛ 0,0.00',
          sign: '៛'
        },
        AED: {
          steps: ['LBCBTC', 'BTCAED'],
          format: 'د.إ0,0.00',
          sign: 'د.إ'
        },
        ZAR: {
          steps: ['LBCBTC', 'BTCZAR'],
          format: 'R 0,0.00',
          sign: 'R'
        },
        PGK: {
          steps: ['LBCBTC', 'BTCPGK'],
          format: 'K 0,0.00',
          sign: 'K'
        },
        EGP: {
          steps: ['LBCBTC', 'BTCEGP'],
          format: 'EGP 0,0.00',
          sign: 'EGP'
        },
        NOK: {
          steps: ['LBCBTC', 'BTCNOK'],
          format: 'kr0,0.00',
          sign: 'kr'
        },
        HUF: {
          steps: ['LBCBTC', 'BTCHUF'],
          format: 'ft0,0.00',
          sign: 'ft'
        },
        ALL: {
          steps: ['LBCBTC', 'BTCALL'],
          format: 'L 0,0.00',
          sign: 'L'
        },
        GEL: {
          steps: ['LBCBTC', 'BTCGEL'],
          format: 'GEL 0,0.00',
          sign: 'GEL'
        },
        MDL: {
          steps: ['LBCBTC', 'BTCMDL'],
          format: 'lei 0,0.00',
          sign: 'lei'
        },
        BAM: {
          steps: ['LBCBTC', 'BTCBAM'],
          format: 'KM 0,0.00',
          sign: 'KM'
        },
        AZN: {
          steps: ['LBCBTC', 'BTCAZN'],
          format: '₼ 0,0.00',
          sign: '₼'
        },
        AMD: {
          steps: ['LBCBTC', 'BTCAMD'],
          format: '֏ 0,0.00',
          sign: '֏'
        },
        BYN: {
          steps: ['LBCBTC', 'BTCBYN'],
          format: 'Br 0,0.00',
          sign: 'Br'
        },
        BTN: {
          steps: ['LBCBTC', 'BTCBTN'],
          format: 'Nu 0,0.00',
          sign: 'Nu'
        },
        NPR: {
          steps: ['LBCBTC', 'BTCNPR'],
          format: 'रु 0,0.00',
          sign: 'रु'
        },
        BDT: {
          steps: ['LBCBTC', 'BTCBDT'],
          format: '৳ 0,0.00',
          sign: '৳'
        },
        PKR: {
          steps: ['LBCBTC', 'BTCPKR'],
          format: 'Rs 0,0.00',
          sign: 'Rs'
        },
        ARS: {
          steps: ['LBCBTC', 'BTCARS'],
          format: '$ 0,0.00',
          sign: '$'
        },
        PLN: {
          steps: ['LBCBTC', 'BTCPLN'],
          format: 'zł 0,0.00',
          sign: 'zł'
        },
        HRK: {
          steps: ['LBCBTC', 'BTCHRK'],
          format: 'kn 0,0.00',
          sign: 'kn'
        },
        BTC: {
          steps: ['LBCBTC'],
          format: '0,0[.][00000000] BTC',
          sign: 'BTC'
        }
      },

      // api steps
      api: {
        LBCBTC: {
          url: 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LBC',
          path: '$.result.Bid'
        },
        BTCUSD: {
          url: 'https://blockchain.info/ticker',
          path: '$.USD.buy'
        },
        BTCGBP: {
          url: 'https://blockchain.info/ticker',
          path: '$.GBP.buy'
        },
        BTCAUD: {
          url: 'https://blockchain.info/ticker',
          path: '$.AUD.buy'
        },
        BTCBRL: {
          url: 'https://blockchain.info/ticker',
          path: '$.BRL.buy'
        },
        BTCCAD: {
          url: 'https://blockchain.info/ticker',
          path: '$.CAD.buy'
        },
        BTCCHF: {
          url: 'https://blockchain.info/ticker',
          path: '$.CHF.buy'
        },
        BTCMYR: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=MYR',
          path: '$.MYR'
        },
        BTCCLP: {
          url: 'https://blockchain.info/ticker',
          path: '$.CLP.buy'
        },
        BTCCNY: {
          url: 'https://blockchain.info/ticker',
          path: '$.CNY.buy'
        },
        BTCDKK: {
          url: 'https://blockchain.info/ticker',
          path: '$.DKK.buy'
        },
        BTCEUR: {
          url: 'https://blockchain.info/ticker',
          path: '$.EUR.buy'
        },
        BTCHKD: {
          url: 'https://blockchain.info/ticker',
          path: '$.HKD.buy'
        },
        BTCINR: {
          url: 'https://blockchain.info/ticker',
          path: '$.INR.buy'
        },
        BTCISK: {
          url: 'https://blockchain.info/ticker',
          path: '$.ISK.buy'
        },
        BTCJPY: {
          url: 'https://blockchain.info/ticker',
          path: '$.JPY.buy'
        },
        BTCKRW: {
          url: 'https://blockchain.info/ticker',
          path: '$.KRW.buy'
        },
        BTCNZD: {
          url: 'https://blockchain.info/ticker',
          path: '$.NZD.buy'
        },
        BTCRUB: {
          url: 'https://blockchain.info/ticker',
          path: '$.RUB.buy'
        },
        BTCSEK: {
          url: 'https://blockchain.info/ticker',
          path: '$.SEK.buy'
        },
        BTCSGD: {
          url: 'https://blockchain.info/ticker',
          path: '$.SGD.buy'
        },
        BTCTHB: {
          url: 'https://blockchain.info/ticker',
          path: '$.THB.buy'
        },
        BTCTWD: {
          url: 'https://blockchain.info/ticker',
          path: '$.TWD.buy'
        },
        BTCBND: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=BND',
          path: '$.BND'
        },
        BTCVND: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=VND',
          path: '$.VND'
        },
        BTCPHP: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=PHP',
          path: '$.PHP'
        },
        BTCSAR: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=SAR',
          path: '$.SAR'
        },
        BTCMXN: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=MXN',
          path: '$.MXN'
        },
        BTCTRY: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=TRY',
          path: '$.TRY'
        },
        BTCMMK: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=MMK',
          path: '$.MMK'
        },
        BTCKHR: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=KHR',
          path: '$.KHR'
        },
        BTCAED: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=AED',
          path: '$.AED'
        },
        BTCZAR: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=ZAR',
          path: '$.ZAR'
        },
        BTCPGK: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=PGK',
          path: '$.PGK'
        },
        BTCNOK: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=NOK',
          path: '$.NOK'
        },
        BTCHUF: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=HUF',
          path: '$.HUF'
        },
        BTCALL: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=ALL',
          path: '$.ALL'
        },
        BTCEGP: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=EGP',
          path: '$.EGP'
        },
        BTCGEL: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=GEL',
          path: '$.GEL'
        },
        BTCMDL: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=MDL',
          path: '$.MDL'
        },
        BTCBAM: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=BAM',
          path: '$.BAM'
        },
        BTCKZT: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=KZT',
          path: '$.KZT'
        },
        BTCAZN: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=AZN',
          path: '$.AZN'
        },
        BTCAMD: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=AMD',
          path: '$.AMD'
        },
        BTCBYN: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=BYN',
          path: '$.BYN'
        },
        BTCBTN: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=BTN',
          path: '$.BTN'
        },
        BTCNPR: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=NPR',
          path: '$.NPR'
        },
        BTCBDT: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=BDT',
          path: '$.BDT'
        },
        BTCPKR: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=PKR',
          path: '$.PKR'
        },
        BTCARS: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=ARS',
          path: '$.ARS'
        },
        BTCPLN: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=PLN',
          path: '$.PLN'
        },
        BTCHRK: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=HRK',
          path: '$.HRK'
        },
        BTCIDR: {
          url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=IDR',
          path: '$.IDR'
        }
      },

      // display date/time format
      dtFormat: 'Do MMM YYYY h:mma [UTC]',

      // refresh rate in milliseconds to retrieve a new price (default to 10 minutes)
      refreshTime: 100000
    };
    let words = suffix
      .trim()
      .split(' ')
      .filter(function(n) {
        return n !== '';
      });

    let currency = words.length > 0 ? words[0].toUpperCase() : options.defaultCurrency;
    let amount = words.length > 1 ? parseFloat(words[1], 10) : 1;
    let showHelp = isNaN(amount) || Object.keys(options.currencies).indexOf(currency) === -1;
    // store the last retrieved rate
    let cachedRates = {};
    let command = '!price';

    let currencies = Object.keys(options.currencies);
    for (let i = 0; i < currencies.length; i++) {
      cachedRates[currencies[i]] = {
        rate: 0,
        time: null
      };
    }
    if (showHelp) {
      doHelp(bot, msg, suffix);
    } else {
      if (!hasPriceBotChannels(msg) && !inPrivate(msg)) {
        msg.channel.send('Please use <#' + ChannelID + '> or DMs to talk to price bot.');
        return;
      }
      doSteps(bot, currency, amount);
    }

    function doHelp(bot, msg, suffix) {
      if (!hasPriceBotChannels(msg) && !inPrivate(msg)) {
        msg.channel.send('Please use <#' + ChannelID + '> or DMs to talk to price bot.');
        return;
      }
      let message = `**${command}**: show the price of 1 LBC in ${options.defaultCurrency}
**${command} help**: this message
**${command} CURRENCY**: show the price of 1 LBC in CURRENCY. Supported values for CURRENCY are Listed Below
**${command} CURRENCY AMOUNT**: show the price of AMOUNT LBC in CURRENCY
**Supported Currencies:** *usd*, *gbp*, *eur*, *aud*, *brl*, *cad*, *chf*, *clp*, *cny*, *dkk*, *hkd*, *inr*, *isk*, *jpy*, *krw*, *nzd*, *pln* ,*rub*, *sek*, *sgd*, *thb*, *twd*, *myr*, *bnd*,*vnd*, *php*, *sar*, *mxn*, *try*, *mmk*, *khr*, *aed*, *zar*, *pgk*, *egp*,*nok*, *hrk*, *huf*, *all*, *gel*, *mdl*, *bam* ,*kzt*, *azn*, *amd*, *byn*, *btn*, *npr*, *bdt*, *pkr*, *ars*, *pln*, *idr* and *btc* (case-insensitive)`;
      msg.channel.send(message);
    }

    function formatMessage(amount, rate, option) {
      let cur = option.sign;
      let value = numeral(rate.rate * amount).format(option.format);
      return `*${numeral(amount).format('0,0[.][00000000]')} LBC = ${cur} ${value}*
_last updated ${rate.time.utc().format(options.dtFormat)}_`;
    }

    function doSteps(bot, currency, amount) {
      let option = options.currencies[currency];
      let shouldReload = true;
      if (cachedRates[currency]) {
        let cache = cachedRates[currency];
        shouldReload = cache.time === null || moment().diff(cache.time) >= options.refreshTime;
        if (!shouldReload) {
          let message = formatMessage(amount, cache, option);
          msg.channel.send(message);
        }
      }

      if (shouldReload) {
        // copy the steps array
        let steps = [];
        for (let i = 0; i < option.steps.length; i++) {
          steps.push(option.steps[i]);
        }

        processSteps(bot, currency, 0, amount, steps, option);
      }
    }

    function processSteps(bot, currency, rate, amount, steps, option) {
      if (steps.length > 0) {
        let pairName = steps[0];
        if (!options.api[pairName]) {
          msg.channel.send(`There was a configuration error. ${pairName} pair was not found.`);
          return;
        }

        let pair = options.api[pairName];
        request.get(pair.url, function(error, response, body) {
          if (error) {
            msg.channel.send(err.message ? err.message : 'The request could not be completed at this time. Please try again later.');
            return;
          }
          let pairRate = 0;
          try {
            pairRate = jp.query(JSON.parse(body), pair.path);
            if (Array.isArray(pairRate) && pairRate.length > 0) {
              pairRate = pairRate[0];
            }
          } catch (ignored) {
            // invalid response or pair rate
          }

          if (pairRate > 0) {
            rate = rate === 0 ? pairRate : rate * pairRate;
            steps.shift();
            if (steps.length > 0) {
              processSteps(bot, currency, rate, amount, steps, option);
              return;
            }

            // final step, cache and then response
            let result = {
              rate: rate,
              time: moment()
            };
            cachedRates[currency] = result;
            msg.channel.send(formatMessage(amount, result, option));
          } else {
            msg.channel.send(`The rate returned for the ${pairName} pair was invalid.`);
          }
        });
      }
    }
  }
};
