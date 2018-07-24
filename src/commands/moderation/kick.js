import { Command } from "discord.js-commando";
import { RichEmbed } from "discord.js";
import { oneLine, stripIndents } from "common-tags";
import { deleteCommandMessages, stopTyping, startTyping } from "../../components/util.js";

module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: "kick",
            memberName: "kick",
            group: "moderation",
            aliases: ["k"],
            description: "Kicks a member from the server",
            format: "MemberID|MemberName(partial or full) [ReasonForKicking]",
            examples: ["kick JohnDoe annoying"],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [
                {
                    key: "member",
                    prompt: "Which member do you want me to kick?",
                    type: "member"
                },
                {
                    key: "reason",
                    prompt: "What is the reason for this kick?",
                    type: "string",
                    default: ""
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission("KICK_MEMBERS");
    }

    run(msg, { member, reason }) {
        startTyping(msg);

        if (member.id === msg.author.id) {
            stopTyping(msg);

            return msg.reply("I don't think you want to kick yourself.");
        }

        if (!member.kickable) {
            stopTyping(msg);

            return msg.reply("I cannot kick that member, their role is probably higher than my own!");
        }

        member.kick(reason !== "" ? reason : "No reason given by staff");
        const kickEmbed = new RichEmbed(),
            modlogChannel = msg.guild.settings.get("modlogchannel", msg.guild.channels.find(c => c.name === "mod-logs") ? msg.guild.channels.find(c => c.name === "mod-logs").id : null);

        kickEmbed
            .setColor("#FF8300")
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
            .setDescription(
                stripIndents`
      **Member:** ${member.user.tag} (${member.id})
      **Action:** Kick
      **Reason:** ${reason !== "" ? reason : "No reason given by staff"}`
            )
            .setTimestamp();

        if (msg.guild.settings.get("modlogs", true)) {
            if (!msg.guild.settings.get("hasSentModLogMessage", false)) {
                msg.reply(oneLine`📃 I can keep a log of moderator actions if you create a channel named \'mod-logs\'
					(or some other name configured by the ${msg.guild.commandPrefix}setmodlogs command) and give me access to it.
					This message will only show up this one time and never again after this so if you desire to set up mod logs make sure to do so now.`);
                msg.guild.settings.set("hasSentModLogMessage", true);
            }
            modlogChannel ? msg.guild.channels.get(modlogChannel).send("", { embed: kickEmbed }) : null;
        }
        deleteCommandMessages(msg, this.client);
        stopTyping(msg);

        return msg.embed(kickEmbed);
    }
};
