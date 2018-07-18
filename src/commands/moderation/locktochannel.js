import { Command } from "discord.js-commando";
import { inPrivate } from "../../components/util.js";

const commandCanBeLocked = ["stats", "hash", "rank"];
module.exports = class IDCommand extends Command {
    constructor(client) {
        super(client, {
            name: "locktochannel",
            aliases: ["ltc"],
            group: "moderation",
            memberName: "locktochannel",
            description: "Lock a specific command to a specific channel.",
            examples: ["locktochannel add stats #general"],
            throttling: {
                usages: 2,
                duration: 3
            },
            guildOnly: true,
            args: [
                {
                    key: "action",
                    label: "action",
                    prompt: "What action would you like to preform? (`add`, `remove` or list.)",
                    type: "string",
                    infinite: false
                },
                {
                    key: "command",
                    prompt: "What command would you like to lock?",
                    type: "string"
                },
                {
                    key: "channel",
                    prompt: "What channel do you want it to be locked to?",
                    default: "#general",
                    type: "channel"
                }
            ]
        });
    }

    async run(msg, { action, command, channel }) {
        if (!msg.guild.member(msg.author).hasPermission("MANAGE_ROLES", false, true, true)) return msg.reply(`You do not have permission to perform this action! You need the MANAGE_CHANNELS permission to use this command.`);
        if (!channel.id) return msg.reply("Could not find that channel, please try again.");
        if (!commandCanBeLocked.includes(command)) return msg.reply(`That is not a command that you can lock.`);
        if (action.toLowerCase() === "add") {
            const guildLocks = await msg.guild.settings.get(`lock_${command}`, []);
            if (guildLocks.includes(channel.id)) return msg.reply("That command is already locked to that channel!");
            guildLocks.push(channel.id);
            await msg.guild.settings.set(`lock_${command}`, guildLocks);
            return msg.reply(`Locked the ${command} command to <#${channel.id}>.`);
        }
        if (action.toLowerCase() === "remove") {
            const guildLocks = await msg.guild.settings.get(`lock_${command}`, []);
            if (!guildLocks.includes(channel.id)) return msg.reply("That command is not locked to that channel.");
            guildLocks.splice(guildLocks.indexOf(command), 1);
            await msg.guild.settings.set(`lock_${command}`, guildLocks);
            return msg.reply(`Removed the lock of ${command} command for channel <#${channel.id}>.`);
        }
        /* Not in a working stage yet.
        if (action.toLowerCase() === "list") {
            const guildLocks = await msg.guild.settings.get(`lock_${command}`, []);
            let channelList = "";
            guildLocks.forEach(rank => {
                channelList += `${rank}\n`;
            });
            const listEmbed = new RichEmbed();
            listEmbed.setAuthor("Wunderbot | Lock Controller").setColor(7976557);
            if (channelList) listEmbed.addField("Command is locked to:", channelList, true);
            return msg.embed(listEmbed);
        } */
    }
};
