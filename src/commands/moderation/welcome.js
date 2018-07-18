import { Command } from "discord.js-commando";

module.exports = class WelcomeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "welcome",
            aliases: ["wel"],
            group: "moderation",
            memberName: "welcome",
            description: "Sends the servers welcome msgs to a user, call with enable/disable instead of user to enable sending on join.",
            examples: ["welcome @Fillerino", "welcome enable/disable"],
            args: [
                {
                    key: "user",
                    label: "user",
                    prompt: "Which user would you like to send to? (type enable/disable instead of user to make it auto send on join)",
                    type: "string",
                    infinite: false
                }
            ],
            guildOnly: true
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission("ADMINISTRATOR");
    }

    async run(msg, { user }) {
        if (user.toLowerCase() === "enable") {
            await msg.guild.settings.set("welcomemsgenabled", true);
            return msg.reply("Enabled automatic sending of welcome message.");
        }
        if (user.toLowerCase() === "disable") {
            await msg.guild.settings.set("welcomemsgenabled", false);
            return msg.reply("Disabled automatic sending of welcome message.");
        }
        if ((await msg.guild.settings.get("welcomemsg", [])) >= 1) {
            const embeds = await msg.guild.settings.get("welcomemsg");
            embeds.forEach(e => msg.mentions.members.first().send({ embed: e }));
        }
    }
};
