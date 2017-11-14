let config = require("config");
let hasPriceBotChannels = require("../helpers.js").hasPriceBotChannels;
let inPrivate = require("../helpers.js").inPrivate;
let ChannelID = config.get("pricebot").mainchannel;
let needle = require('needle');

exports.commands = [
  "altstats"
]

exports.altstats = {
  usage: "<coin>",
  description: 'gets coin market cap stats for specified coin trading symbol',
  process: function(bot,msg,suffix){
    if(!hasPriceBotChannels(msg) && !inPrivate(msg)){
    msg.channel.send('Please use <#' + ChannelID + '> or DMs to talk to price bot.');
    return;
    }
    if (suffix !== "") {
      words = suffix.trim().split(" ").filter(function(n) {return n !== "";});
      var currency = words[0]
      var coin = currency.toUpperCase()
      } else {
        coin = "BTC"
      }
    needle.get('https://api.coinmarketcap.com/v1/ticker/?limit=10000', function(error, response) {
      if (error || response.statusCode !== 200) {
        msg.channel.send('coinmarketcap API is not available');
      } else {
        var JSON1 = response.body
        for (var index = 0; index < JSON1.length; ++index) {
         var coins = JSON1[index];
         if(coins.symbol == coin){
           var hasMatch = true;
         } else {
           var hasMatch = false;
         }
        }
          if (!coins) {
            msg.channel.send("Invalid Alt Coin")
            return
          } else {
            var symbol = coin
          }
          var position = Number(JSON1.findIndex(symbols => symbols.symbol == symbol))
          var name = response.body[position].id
          var apiurl = 'https://api.coinmarketcap.com/v1/ticker/'+name+'/'
    needle.get(apiurl, function(error, response) {
      if (error || response.statusCode !== 200) {
        msg.channel.send('coinmarketcap API is not available');
      } else {
          var data = response.body[0];
          var rank = data.rank
          var price_usd = Number(data.price_usd)
          var price_btc = Number(data.price_btc)
          var market_cap_usd = Number(data.market_cap_usd)
          var available_supply = Number(data.available_supply)
          var total_supply = Number(data.total_supply)
          var percent_change_1h = Number(data.percent_change_1h)
          var percent_change_24h = Number(data.percent_change_24h)
          var json = response.body[0];
          var newjson = parse_obj(json)
          var parse = JSON.stringify(newjson)
          var volume24_usd = parse.replace(/[^0-9]/g, '');
          var dt = new Date();
          var timestamp = dt.toUTCString();
          var hr_indicator = ":thumbsup:"
          var day_indicator =":thumbsup:"
          if (percent_change_1h < 0) {
            hr_indicator = ":thumbsdown:"
          }
          if (percent_change_24h < 0) {
            day_indicator = ":thumbsdown:"
          }

          needle.get(apiurl+'?convert=GBP', function(error, response) {
            if (error || response.statusCode !== 200) {
              msg.channel.send('coinmarketcap API is not available');
            } else {
              var data = response.body[0];
              var price_gbp = Number(data.price_gbp)
              needle.get(apiurl+'?convert=EUR', function(error, response) {
                if (error || response.statusCode !== 200) {
                  msg.channel.send('coinmarketcap API is not available');
                } else {
                  var data = response.body[0];
                  var price_eur = Number(data.price_eur)
                  description = "**Rank: ["+rank+"](apiurl)**\n" +
                  "**Data**\n" +
                  "Market Cap: [$"+numberWithCommas(market_cap_usd)+"]("+apiurl+") \n" +
                  "Total Supply: ["+numberWithCommas(total_supply)+" BTC]("+apiurl+")\n" +
                  "Circulating Supply: ["+numberWithCommas(available_supply)+" BTC]("+apiurl+")\n" +
                  "24 Hour Volume: [$"+volume24_usd+"]("+apiurl+") \n\n" +
                  "**Price**\n" +
                  "BTC: [₿"+price_btc.toFixed(8)+"]("+apiurl+")\n" +
                  "USD: [$"+price_usd.toFixed(2)+"]("+apiurl+") \n" +
                  "EUR: [€"+price_eur.toFixed(2)+"]("+apiurl+") \n" +
                  "GBP: [£"+price_gbp.toFixed(2)+"]("+apiurl+") \n\n" +
                  "**% Change**\n" +
                  "1 Hour:  ["+percent_change_1h+"]("+apiurl+")   "+hr_indicator+" \n\n" +
                  "1 Day:   ["+percent_change_24h+"]("+apiurl+")   "+day_indicator+" \n\n"
                  const embed = {
                    "description": description,
                    "color": 7976557,
                    "footer": {
                      "text": "Last Updated: "+timestamp
                    },
                    "author": {
                      "name": "Coin Market Cap Stats ("+symbol+")",
                      "url": apiurl,
                      "icon_url": "https://upload.wikimedia.org/wikipedia/commons/5/50/Bitcoin.png"
                    }
                  };
                  msg.channel.send({ embed })
                }
              })
            }
          })
        }
      })
    }
  })
  function parse_obj(obj)
  {
    var array = [];
    var prop;
    for (prop in obj)
    {
        if (obj.hasOwnProperty(prop))
        {
            var key = parseInt(prop, 10);
            var value = obj[prop];
            if (typeof value == "object")
            {
                value = parse_obj(value);
            }
            array[key] = value;
        }
    }
    return array;
  }
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
    }
}
