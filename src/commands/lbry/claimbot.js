// Claimbot is a work in progress, it will use chainquery when done.
import { RichEmbed } from "discord.js";
import config from "config";

const Commando = require("discord.js-commando");

let time = null;
const channels = config.get("Wunderbot.claimbot");
module.exports = class ClaimCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "claimbot",
            aliases: ["cb"],
            group: "lbry",
            memberName: "claimbot",
            description: "Enables/disables the claimbot for the current channel.",
            examples: ["claimbot enable"],
            args: [
                {
                    key: "action",
                    label: "action",
                    prompt: "What action would you like to preform? (`enable` or `disable`)",
                    type: "string"
                }
            ],
            guildOnly: true,
            guarded: true
        });
        client.on("ready", async () => {
            setInterval(() => {
                this.checkNewClaims();
            }, 300000); // Check for new claims every 5 minutes
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission("ADMINISTRATOR");
    }

    async run(msg, { action }) {
        if (action.toLowerCase() === "test") {
            console.log(await this.getClaimsSince(bootupTime));
        }
    }
    async checkNewClaims() {
        if (time === null) {
            time = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
        } else {
            const claims = await this.getClaimsSince(time);
            // Output claims to channels
            claims.data.forEach(c => {
                const v = JSON.parse(c.value);
                this.postToDiscord(c, v);
            });
            time = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
        }
    }

    postToDiscord(claim, value) {
        const text = [];
        if (value.author) {
            text.push(`author: ${value.author}`);
        }
        if (value.description) {
            text.push(value.description);
        }
        // if (value['content_type'])
        // {
        //   text.push("*Content Type:* " + value['content_type']);
        // }
        if (value.nsfw) {
            text.push("*Warning: Adult Content*");
        }

        // "fee":{"currency":"LBC","amount":186,"version":"_0_0_1","address":"bTGoFCakvQXvBrJg1b7FJzombFUu6iRJsk"}
        if (value.fee) {
            const fees = [];
            text.push(`Price: ${value.fee.amount} *${value.fee.currency}*`);
        }

        const claimEmbed = new RichEmbed();
        claimEmbed
            .setAuthor(value.author || "Anonymous", "http://barkpost-assets.s3.amazonaws.com/wp-content/uploads/2013/11/3dDoge.gif", `http://open.lbry.io/${claim.name}#${claim.claimId}`)
            .setTitle(`lbry://${channelName ? `${channelName}/` : ""}${claim.name}`)
            .setColor(1399626)
            .setDescription(this.escapeSlackHtml(text.join("\n")))
            .setFooter(`Block ${claimBlockHeight} • Claim ID ${claim.claimId}`)
            .setImage(!value.nsfw ? value.thumbnail || "" : "")
            .setURL(`http://open.lbry.io/${claim.name}#${claim.claimId}`);
        channels.forEach(channel => {
            this.bot.channels
                .get(channel)
                .send("", { embed: claimEmbed })
                .catch(console.error);
        });
    }
    async getClaimsSince(time) {
        const query = `${`${`` + `SELECT ` + `name, `}${`fee, ``value_as_json as value, `}bid_state, ` +
            `effective_amount, ` +
            `claim_id as claimId ` +
            // `,transaction_by_hash_id, ` + // txhash and vout needed to leverage old format for comparison.
            // `vout ` +
            `FROM claim ` +
            `WHERE created >='`}${time}'`;
        const claimList = await this.client.request({
            url: `https://chainquery.lbry.io/api/sql?query=${query}`,
            cacheKey: `https://chainquery.lbry.io/api/sql?query=${query}`,
            cacheTTL: 0,
            cacheLimit: 1,
            resolveWithFullResponse: false
        });
        return JSON.parse(claimList);
    }
    escapeSlackHtml(txt) {
        return txt
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;");
    }
};
