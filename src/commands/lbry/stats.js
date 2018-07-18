import { Command } from "discord.js-commando";
import { RichEmbed } from "discord.js";
import { locked } from "../../components/util";

module.exports = class StatsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "stats",
            aliases: ["lbrystats"],
            group: "lbry",
            memberName: "lbrystats",
            description: "Displays list of current Market stats",
            throttling: {
                usages: 2,
                duration: 3
            },
            guildOnly: true,
            args: null
        });
    }

    async run(msg) {
        const lockStatus = await locked("stats", msg);
        if (lockStatus) {
            let channelList = "";
            lockStatus.forEach(channel => {
                channelList += `<#${channel}> `;
            });
            return msg.reply(`This command cannot be ran from this channel, only from: ${channelList}`);
        }
        try {
            // Extract the URL(s).
            const { body, headers } = await this.client.request({
                url: "https://api.coinmarketcap.com/v2/ticker/1298/?convert=BTC",
                cacheKey: "https://api.coinmarketcap.com/v2/ticker/1298/?convert=BTC",
                cacheTTL: 120000,
                cacheLimit: 3,
                resolveWithFullResponse: true
            });
            const { data } = JSON.parse(body);
            const { rank } = data;
            const priceUSD = Number(data.quotes.USD.price);
            const priceBTC = Number(data.quotes.BTC.price);
            const marketCapUSD = Number(data.quotes.USD.market_cap);
            const circulatingSupply = Number(data.circulating_supply);
            const totalSupply = Number(data.total_supply);
            const percentChange1h = Number(data.quotes.USD.percent_change_1h);
            const percentChange24h = Number(data.quotes.USD.percent_change_24h);
            const volume24USD = Number(data.quotes.USD.volume_24h);
            const dt = new Date();
            const timestamp = dt.toUTCString();
            let hrIndicator = ":thumbsup:";
            let dayIndicator = ":thumbsup:";
            if (percentChange1h < 0) {
                hrIndicator = ":thumbsdown:";
            }
            if (percentChange24h < 0) {
                dayIndicator = ":thumbsdown:";
            }
            const url2Response = await this.client.request({
                url: "https://api.coinmarketcap.com/v2/ticker/1298/?convert=GBP",
                cacheKey: "https://api.coinmarketcap.com/v2/ticker/1298/?convert=GBP",
                cacheTTL: 120000,
                cacheLimit: 3,
                resolveWithFullResponse: true
            });
            const priceGBP = JSON.parse(url2Response.body).data.quotes.GBP.price;
            const url3Response = await this.client.request({
                url: "https://api.coinmarketcap.com/v2/ticker/1298/?convert=EUR",
                cacheKey: "https://api.coinmarketcap.com/v2/ticker/1298/?convert=EUR",
                cacheTTL: 120000,
                cacheLimit: 3,
                resolveWithFullResponse: true
            });
            const priceEUR = JSON.parse(url3Response.body).data.quotes.EUR.price;
            const statsEmbed = new RichEmbed();
            statsEmbed
                .setAuthor("Coin Market Cap Stats (LBC)", "https://i.imgur.com/yWf5USu.png", "https://coinmarketcap.com/currencies/library-credit/")
                .setColor(7976557)
                .addField("Rank", rank, true)
                .addField("Market Cap", `$${this.numberWithCommas(marketCapUSD)}`, true)
                .addField("Total Supply", `${this.numberWithCommas(totalSupply)} LBC`, true)
                .addField("Circulating Supply", `${this.numberWithCommas(circulatingSupply)} LBC`, true)
                .addField("24 Hour Volume", `$${volume24USD}`, true)
                .addField("Price in BTC", `${priceBTC.toFixed(8)} BTC`, true)
                .addField("Price in USD", `$${priceUSD.toFixed(2)}`, true)
                .addField("Price in EUR", `€${priceEUR.toFixed(2)}`, true)
                .addField("Price in GBP", `£${priceGBP.toFixed(2)}`, true)
                .addField("Change the last hour", `${percentChange1h} ${hrIndicator}`, false)
                .addField("Change the last day", `${percentChange24h} ${dayIndicator}`, false);
            return msg.embed(statsEmbed);
        } catch (e) {
            console.log(e);
            msg.channel.send("Could not connect to the API, try again later.");
        }
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};
