let needle = require('needle');
let hasPriceBotChannels = require('../helpers.js').hasPriceBotChannels;
let inPrivate = require('../helpers.js').inPrivate;
let config = require('config');
let ChannelID = config.get('pricebot').mainchannel;

exports.commands = [
  "altprice"
]

exports.altprice = {
  usage: "<coin> <fiat/coin> <amount>",
  description: 'display price of specified alt coin from crypto compare\n**Example:** *!altprice ETH USD 100*',
  process: function(bot,msg,suffix){
    let dt = new Date();
    let timestamp = dt.toUTCString();
    if(!hasPriceBotChannels(msg) && !inPrivate(msg)){
    msg.channel.send('Please use <#' + ChannelID + '> or DMs to talk to price bot.');
    return;
    }
    if (suffix !== "") {
      words = suffix.trim().split(" ").filter(function(n) {return n !== "";});
      var currency1 = words[0].toUpperCase()
      if (words[1] == undefined) {
              var currency2 = "BTC"
      } else {
          var currency2 = words[1].toUpperCase()
      }
      if (words[2] == undefined) {
        var amount = "1"
      } else {
          if (getValidatedAmount(words[2]) === null) {
            msg.reply('Please specify a number for <amount>');
            return;
          }
        var amount = words[2].toUpperCase()
      }
    } else {
      var currency1 = "BTC"
      var currency2 = "USD"
      var amount = "1"
    }
    needle.get('https://min-api.cryptocompare.com/data/all/coinlist', function(error, response) {
      if (error || response.statusCode !== 200) {
        msg.channel.send('coinmarketcap API is not available');
      } else {
          if (!response.body.Data.hasOwnProperty(currency1)) {
            msg.channel.send("Invalid Alt Coin")
            return
          }
          needle.get('https://min-api.cryptocompare.com/data/price?fsym='+currency1+'&tsyms='+currency2, function(error, response) {
            if (error || response.statusCode !== 200) {
              msg.channel.send('coinmarketcap API is not available');
            } else {
              var price = Number(response.body[currency2])
              var newprice = price * amount
              var message = amount+" "+currency1+" = "+newprice.toFixed(8)+" "+currency2+"\n" +
              "*Updated: "+timestamp+"*";
              msg.channel.send(message)
            }
          })
        }
    })
    function getValidatedAmount(amount) {
      amount = amount.trim();
      return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
    }
  }
}
