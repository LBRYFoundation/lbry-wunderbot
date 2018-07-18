import commando from "discord.js-commando";
import Discord from "discord.js";

module.exports = class PriceCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "price",
            aliases: ["cp", "altprice"],
            group: "crypto",
            memberName: "price",
            description: "Displays price of a specific alt coin from cryptocompare.",
            examples: ["price BTC USD 1", "price LBC EUR 100"],
            guildOnly: false,

            args: [
                {
                    key: "coin",
                    label: "coin",
                    prompt: "What coin would you like to check the value of?",
                    default: "LBC",
                    type: "string"
                },
                {
                    key: "fiat",
                    label: "fiat",
                    prompt: "The fiat currency to check?",
                    default: "USD",
                    type: "string"
                },
                {
                    key: "amount",
                    label: "amount",
                    prompt: "The number of coins to check the value of?",
                    default: 100,
                    type: "float"
                }
            ]
        });
    }

    async run(msg, { coin, fiat, amount }) {
        try {
            const url = `https://min-api.cryptocompare.com/data/price?fsym=${coin.toUpperCase()}&tsyms=${fiat.toUpperCase()}`;
            const { body, headers } = await this.client.request({
                url,
                cacheKey: url,
                cacheTTL: 120000,
                cacheLimit: 3,
                resolveWithFullResponse: true
            });
            const coinVal = JSON.parse(body)[fiat.toUpperCase()];
            const embed = new Discord.RichEmbed()
                .setTitle(`The value of ${amount} ${coin.toUpperCase()} in ${fiat.toUpperCase()}`)
                .setColor(0x00ae86)
                .setFooter("Wunderbot | Cryptocompare API", "http://i.imgur.com/w1vhFSR.png")
                .setTimestamp(new Date(Date.parse(headers.date)))
                .setURL(`https://www.cryptocompare.com/coins/${coin.toLowerCase()}/overview/${fiat.toLowerCase()}`)
                .addField("Price per coin", `The price per coin is ${coinVal} ${fiat.toUpperCase()}`)
                .addField("Result", `The value of ${amount} ${coin.toUpperCase()} is ${(coinVal * amount).toFixed(3)} ${fiat.toUpperCase()}`);
            return msg.embed(embed);
        } catch (e) {
            console.log(e);
            return msg.reply("Could not talk to the cryptocompare API. Try again later.");
        }
    }
};
