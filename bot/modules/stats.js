let needle = require('needle');
let statsurl = 'https://www.coingecko.com/en/coins/lbry-credits';
exports.commands = [
    'stats' // command that is in this file, every command needs it own export as shown below
];

exports.stats = {
    usage: '',
    description: 'Displays list of Current Market Statistics',
    process: function(bot, msg) {
        needle.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=btc&ids=lbry-credits&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C1h%2C7d', function(error, response) {
            if (error || response.statusCode !== 200) {
                msg.channel.send('coingecko API is not available');
            } else {
		//console.log(response);
		//console.log(response.body[0]);
                let data = response.body[0];
                let rank = data.market_cap_rank;
                let price_btc = Number(data.current_price);
                let circulating_supply = Number(data.circulating_supply);
                let total_supply = Number(data.total_supply);
                let percent_change_1h = Number(data.price_change_percentage_1h_in_currency);
                let percent_change_24h = Number(data.price_change_percentage_24h_in_currency);
                let dt = new Date();
                let timestamp = dt.toUTCString();
                let hr_indicator = (percent_change_1h < 0) ? ':thumbsdown:' : ':thumbsup:';
                let day_indicator = (percent_change_24h < 0) ? ':thumbsdown:' : ':thumbsup:';

                needle.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&ids=lbry-credits&order=market_cap_desc&per_page=100&page=1&sparkline=false', function (error, response) {
                    if (error || response.statusCode !== 200) {
                        msg.channel.send('coingecko API is not available');
                    } else {
                        data = response.body[0];
                        let price_gbp = Number(data.current_price);
                        needle.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=lbry-credits&order=market_cap_desc&per_page=100&page=1&sparkline=false', function (error, response) {
                            if (error || response.statusCode !== 200) {
                                msg.channel.send('coingecko API is not available');
                            } else {
                                data = response.body[0];
                                let price_eur = Number(data.current_price);
                                needle.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=lbry-credits&order=market_cap_desc&per_page=100&page=1&sparkline=false', function (error, response) {
                                    if (error || response.statusCode !== 200) {
                                        msg.channel.send('coingecko API is not available');
                                    } else {
                                        data = response.body[0];
                                        let price_usd = Number(data.current_price);
					let market_cap_usd = Number(data.market_cap);
					let volume24_usd = Number(data.total_volume);
                                        let description = `**Rank: [${rank}](${statsurl})**
                                        **Data**
                                        Market Cap: [$${numberWithCommas(market_cap_usd)}](${statsurl}) 
                                        Total Supply: [${numberWithCommas(total_supply)} LBC](${statsurl})
                                        Circulating Supply: [${numberWithCommas(circulating_supply.toFixed(0))} LBC](${statsurl})
                                        24 Hour Volume: [$${numberWithCommas(volume24_usd)}](${statsurl}) 
                                        
                                        **Price**
                                        BTC: [₿${price_btc.toFixed(8)}](${statsurl})
                                        USD: [$${price_usd.toFixed(5)}](${statsurl}) 
                                        EUR: [€${price_eur.toFixed(5)}](${statsurl}) 
                                        GBP: [£${price_gbp.toFixed(5)}](${statsurl}) 
                                        
                                        **% Change**
                                        1 Hour:  [${percent_change_1h.toFixed(2)}%](${statsurl})   ${hr_indicator} 
                                        
                                        1 Day:   [${percent_change_24h.toFixed(2)}%](${statsurl})   ${day_indicator}`;
                                        const embed = {
                                            description: description,
                                            color: 7976557,
                                            footer: {
                                                text: 'Last Updated: ' + timestamp
                                            },
                                            author: {
                                                name: 'Coin Gecko Stats (LBC)',
                                                url: statsurl,
                                                icon_url: 'https://spee.ch/2/pinkylbryheart.png'
                                            }
                                        };
                                        msg.channel.send({embed});
                                    }
                                });
                            }
                        });
                    }
                });

                function parse_obj(obj) {
                    let array = [];
                    let prop;
                    for (prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            let key = parseInt(prop, 10);
                            let value = obj[prop];
                            if (typeof value == 'object') {
                                value = parse_obj(value);
                            }
                            array[key] = value;
                        }
                    }
                    return array;
                }

                function numberWithCommas(x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
            }
        })
    }
}

