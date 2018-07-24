import { Command } from "discord.js-commando";
import { stopTyping, startTyping } from "../../components/util.js";

module.exports = class PurgeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "purge",
            memberName: "purge",
            group: "moderation",
            aliases: ["prune", "delete"],
            description: "Purge a certain amount of messages",
            format: "AmountOfMessages",
            examples: ["purge 5"],
            guildOnly: true,
            args: [
                {
                    key: "amount",
                    prompt: "How many messages should I purge?",
                    min: 1,
                    max: 100,
                    type: "integer"
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission("MANAGE_MESSAGES");
    }

    async run(msg, { amount }) {
        startTyping(msg);
        if (!msg.channel.permissionsFor(msg.guild.me).has("MANAGE_MESSAGES")) {
            stopTyping(msg);

            return msg.reply("I do not have permission to delete messages from this channel. Better go and fix that!");
        }

        amount = amount === 100 ? 99 : amount;
        msg.channel.bulkDelete(amount + 1, true);

        const reply = await msg.say(`\`Deleted ${amount + 1} messages\``);

        stopTyping(msg);

        return reply.delete({
            timeout: 1000,
            reason: "Deleting own return message after purge"
        });
    }
};
