import { Command } from "discord.js-commando";
import { RichEmbed } from "discord.js";
import { oneLine, stripIndents } from "common-tags";
import { deleteCommandMessages, stopTyping, startTyping } from "../../components/util.js";

module.exports = class ModLogsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "modlogs",
            memberName: "modlogs",
            group: "moderation",
            aliases: ["togglemod"],
            description: "Toggle mod logs in the mod-logs (or by you configured with setmodlogs) channel",
            format: "BooleanResolvable",
            examples: ["modlogs {option}", "modlogs enable"],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [
                {
                    key: "option",
                    prompt: "Enable or disable modlogs?",
                    type: "boolean",
                    validate: bool => {
                        const validBools = ["true", "t", "yes", "y", "on", "enable", "enabled", "1", "+", "false", "f", "no", "n", "off", "disable", "disabled", "0", "-"];

                        if (validBools.includes(bool.toLowerCase())) {
                            return true;
                        }

                        return stripIndents`Has to be one of ${validBools.map(val => `\`${val}\``).join(", ")}
            Respond with your new selection or`;
                    }
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission("ADMINISTRATOR");
    }

    run(msg, { option }) {
        startTyping(msg);

        const modlogChannel = msg.guild.settings.get("modlogchannel", msg.guild.channels.find(c => c.name === "mod-logs") ? msg.guild.channels.find(c => c.name === "mod-logs").id : null);
        const modlogsEmbed = new RichEmbed();

        msg.guild.settings.set("modlogs", option);

        modlogsEmbed
            .setColor("#3DFFE5")
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
            .setDescription(
                stripIndents`
      **Action:** Moderator logs are now ${option ? "enabled" : "disabled"}
      **Details:** Please ensure you configure modlogs with \`${msg.guild.commandPrefix}setmodlogs\` or have a channel named \`mod-logs\`
      `
            )
            .setTimestamp();

        if (msg.guild.settings.get("modlogs", true)) {
            if (!msg.guild.settings.get("hasSentModLogMessage", false)) {
                msg.reply(oneLine`📃 I can keep a log of moderator actions if you create a channel named \'mod-logs\'
                (or some other name configured by the ${msg.guild.commandPrefix}setmodlogs command) and give me access to it.
                This message will only show up this one time and never again after this so if you desire to set up mod logs make sure to do so now.`);
                msg.guild.settings.set("hasSentModLogMessage", true);
            }
            modlogChannel ? msg.guild.channels.get(modlogChannel).send("", { embed: modlogsEmbed }) : null;
        }

        deleteCommandMessages(msg, this.client);
        stopTyping(msg);

        return msg.embed(modlogsEmbed);
    }
};
