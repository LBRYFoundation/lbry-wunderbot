import { Command } from "discord.js-commando";

module.exports = class SupportCommand extends Command {
    constructor(client) {
        super(client, {
            name: "close",
            memberName: "suppbot",
            group: "lbry",
            description: "Helps a user close a ticket.",
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    run(msg) {
        msg.channel.send("-close").catch(console.error);
        setTimeout(() => {
            msg.channel.send("-close").catch(console.error);
        }, 4000);
    }
};
