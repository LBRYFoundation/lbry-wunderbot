// Claimbot is a work in progress, it will use chainquery when done.
/* import { Command } from "discord.js-commando";
import { RichEmbed } from "discord.js";
import welcomeEvent from "../../helpers/welcomeEvent";

let bootupTime = null;
module.exports = class ClaimCommand extends Command {
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
        client.on("ready", () => {
            bootupTime = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
            this.checkGuilds();
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission("ADMINISTRATOR");
    }

    async run(msg, { action }) {
        if (action.toLowerCase() === "enable") {
        }
        if (action.toLowerCase() === "disable") {
        }
        if (action.toLowerCase() === "test") {
            console.log(
                await this.getNewClaimsSince(
                    new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " ")
                )
            );
        }
    }

    checkGuilds(){

    }
    async getNewClaimsSince(date, guild_id) {
        const query = `${`` +
            `SELECT ` +
            `name, ` +
            `value_as_json as value, ` +
            `bid_state, ` +
            `effective_amount, ` +
            `claim_id as claimId ` +
            // `,transaction_by_hash_id, ` + // txhash and vout needed to leverage old format for comparison.
            // `vout ` +
            `FROM claim ` +
            `WHERE modified >='`}${date}'`;
        const newClaims = await this.client.request({
            url: `https://chainquery.lbry.io/api/sql?query=${query}`,
            cacheKey: `https://chainquery.lbry.io/api/sql?query=${query}`,
            cacheTTL: 1,
            cacheLimit: 1,
            resolveWithFullResponse: false
        });
        console.log(newClaims);
    }
};
*/
