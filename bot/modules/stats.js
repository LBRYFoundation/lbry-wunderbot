let jp = require('jsonpath');
let moment = require('moment');
let numeral = require('numeral');
let request = require('request');
let config = require('config');
let needle = require('needle');
let hasStatsBotChannels = require('../helpers.js').hasStatsBotChannels;
let inPrivate = require('../helpers.js').inPrivate;
let ChannelID = config.get('statsbot').mainchannel;
let statsurl = "https://coinmarketcap.com/currencies/library-credit/"
exports.commands = [
	"stats" // command that is in this file, every command needs it own export as shown below
]

exports.stats = {
	usage: "",
	description: 'Displays list of current Market stats',
	process: function(bot,msg){
		needle.get('https://api.coinmarketcap.com/v1/ticker/library-credit/', function(error, response) {
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

					needle.get('https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=GBP', function(error, response) {
						if (error || response.statusCode !== 200) {
							msg.channel.send('coinmarketcap API is not available');
						} else {
							var data = response.body[0];
							var price_gbp = Number(data.price_gbp)
							needle.get('https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=EUR', function(error, response) {
								if (error || response.statusCode !== 200) {
									msg.channel.send('coinmarketcap API is not available');
								} else {
									var data = response.body[0];
									var price_eur = Number(data.price_eur)
									description = "**Rank: ["+rank+"]("+statsurl+")**\n" +
									"**Data**\n" +
									"Market Cap: [$"+numberWithCommas(market_cap_usd)+"]("+statsurl+") \n" +
									"Total Supply: ["+numberWithCommas(total_supply)+" LBC]("+statsurl+")\n" +
									"Circulating Supply: ["+numberWithCommas(available_supply)+" LBC]("+statsurl+")\n" +
									"24 Hour Volume: [$"+volume24_usd+"]("+statsurl+") \n\n" +
									"**Price**\n" +
									"BTC: [₿"+price_btc.toFixed(8)+"]("+statsurl+")\n" +
									"USD: [$"+price_usd.toFixed(2)+"]("+statsurl+") \n" +
									"EUR: [€"+price_eur.toFixed(2)+"]("+statsurl+") \n" +
									"GBP: [£"+price_gbp.toFixed(2)+"]("+statsurl+") \n\n" +
									"**% Change**\n" +
									"1 Hour:  ["+percent_change_1h+"]("+statsurl+")   "+hr_indicator+" \n\n" +
									"1 Day:   ["+percent_change_24h+"]("+statsurl+")   "+day_indicator+" \n\n"
									const embed = {
										"description": description,
										"color": 7976557,
										"footer": {
				      				"text": "Last Updated: "+timestamp
				    				},
										"author": {
											"name": "Coin Market Cap Stats (LBC)",
											"url": statsurl,
											"icon_url": "https://i.imgur.com/yWf5USu.png"
										}
									};
									msg.channel.send({ embed })
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
