import { Command } from "discord.js-commando";
import { RichEmbed } from "discord.js";
import { locked } from "../../components/util.js";

module.exports = class HashCommand extends Command {
    constructor(client) {
        super(client, {
            name: "hash",
            aliases: ["hash"],
            group: "lbry",
            memberName: "lbryhash",
            description: "Sends LBRY mining information to the channel.",
            throttling: {
                usages: 2,
                duration: 3
            },
            guildOnly: true,
            args: null
        });
    }

    async run(msg) {
        const lockStatus = await locked("hash", msg);
        if (lockStatus) {
            let channelList = "";
            lockStatus.forEach(channel => {
                channelList += `<#${channel}> `;
            });
            return msg.reply(`This command cannot be ran from this channel, only from: ${channelList}`);
        }
        this.sendMiningInfo(msg);
    }
    async sendMiningInfo(msg) {
        try {
            let expResponse = await this.client.request({
                url: "https://explorer.lbry.io/api/v1/status",
                cacheKey: "https://explorer.lbry.io/api/v1/status",
                cacheTTL: 120000,
                cacheLimit: 3,
                resolveWithFullResponse: true
            });
            expResponse = JSON.parse(expResponse.body);
            let wtmResponse = await this.client.request({
                url: "https://whattomine.com/coins/164.json",
                cacheKey: "ttps://whattomine.com/coins/164.json",
                cacheTTL: 120000,
                cacheLimit: 3,
                resolveWithFullResponse: true
            });
            wtmResponse = JSON.parse(wtmResponse.body);
            const height = Number(expResponse.status.height);
            const { hashrate } = expResponse.status;
            const difficulty = Number(expResponse.status.difficulty);
            const reward = Number(wtmResponse.block_reward);
            const blockTime = Number(wtmResponse.block_time);
            const diff24 = Number(wtmResponse.difficulty24);
            const hashEmbed = new RichEmbed();
            hashEmbed
                .setAuthor("LBRY Network Stats", "https://i.imgur.com/yWf5USu.png", "https://explorer.lbry.io")
                .setColor(7976557)
                .addField("Hashrate", this.numberWithCommas(hashrate), true)
                .addField("Difficulty", this.numberWithCommas(difficulty.toFixed(0)), true)
                .addField("Difficulty 24 Hour Average:", this.numberWithCommas(diff24.toFixed(0)), true)
                .addField("Current block:", this.numberWithCommas(height.toFixed(0)), true)
                .addField("Block Time:", this.numberWithCommas(blockTime.toFixed(0)), true)
                .addField("Block Reward:", `${reward.toFixed(0)} LBC`, true);
            return msg.embed(hashEmbed);
        } catch (e) {
            console.log(e);
            return msg.channel.send("Explorer API is not available");
        }
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};
