import { Command } from "discord.js-commando";
import { RichEmbed } from "discord.js";
import { oneLine } from "common-tags";
// const rawJSON = require('./ranks.json');

module.exports = class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: "rank",
            aliases: ["ranks", "role", "roles", "roleme"],
            group: "general",
            memberName: "rank",
            description: "Adds or removes a public role to a user.",
            details: oneLine`Do you want to opt-in to a special channel? Do you want to show what games you play?
			This command allows members to get or remove public roles.`,
            examples: ["rank give ping"],
            args: [
                {
                    key: "action",
                    label: "action",
                    prompt: "What action would you like to preform? (`add`, `remove`, or `list`)",
                    type: "string",
                    infinite: false
                },
                {
                    key: "rank",
                    label: "rank",
                    prompt: "",
                    type: "string",
                    default: "",
                    infinite: false
                }
            ],
            guildOnly: true,
            guarded: true
        });
    }

    async run(msg, args) {
        if (args.action.toLowerCase() === "give" || args.action.toLowerCase() === "add") {
            if (!msg.guild.member(this.client.user).hasPermission("MANAGE_ROLES")) return msg.reply("I do not have permission to manage roles! Contact a mod or admin.");
            const rankToGive = msg.guild.roles.find("name", args.rank);
            if (rankToGive === null) return msg.reply("That is not a role! Was your capatalization and spelling correct?");
            if (!(await msg.guild.settings.get("ranks", null))) return msg.reply(`There are no public roles! Maybe try adding some? Do \`${msg.guild.commandPrefix}rank add role\` to add a role.`);
            if (!(await msg.guild.settings.get("ranks", []).includes(args.rank))) return msg.reply(`That role can not be added! Use \`${msg.guild.commandPrefix}rank list\` to see a list of ranks you can add.`);
            msg.guild
                .member(msg.author)
                .addRole(msg.guild.roles.find("name", args.rank))
                .then(() => {
                    msg.reply("Rank given.");
                })
                .catch(() => msg.reply("Something went wrong. Is my role above the role you're trying to give?"));
        } else if (args.action.toLowerCase() === "take" || args.action.toLowerCase() === "remove") {
            if (!msg.guild.member(this.client.user).hasPermission("MANAGE_ROLES")) return msg.reply("I do not have permission to manage roles! Contact a mod or admin.");
            const rankToTake = msg.guild.roles.find("name", args.rank);
            if (rankToTake === null) return msg.reply("That is not a role! Was your capatalization and spelling correct?");
            if (!(await msg.guild.settings.get("ranks", null))) return msg.reply(`There are no public roles! Maybe try adding some? Do \`${msg.guild.commandPrefix}rank add role\` to add a role.`);
            if (!(await msg.guild.settings.get("ranks", []).includes(args.rank))) return msg.reply(`That role can not be taken! Use \`${msg.guild.commandPrefix}rank list\` to see a list of ranks you can add.`);
            msg.guild
                .member(msg.author)
                .removeRole(msg.guild.roles.find("name", args.rank))
                .then(() => {
                    msg.reply("Rank taken.");
                })
                .catch(() => msg.reply("Something went wrong. Is my role above the role you're trying to give?"));
        } else if (args.action.toLowerCase() === "list") {
            const guildRanks = await msg.guild.settings.get("ranks", null);
            if (!guildRanks) return msg.reply(`There are no public roles! Maybe try adding some? Do \`${msg.guild.commandPrefix}pubranks add role\` to add a role.`);
            let rankList = "";
            guildRanks.forEach(rank => {
                rankList += `${rank}\n`;
            });
            const rankEmbed = new RichEmbed();
            rankEmbed.setAuthor("Wunderbot | Rank Controller").setColor(7976557);
            if (rankList) rankEmbed.addField("Ranks available:", rankList, true);
            msg.embed(rankEmbed);
        } else {
            return msg.reply(`Invalid command usage. Please use \`add\`, \`remove\`, or \`list\`.
**NOTE:** If you're trying to add a public role, do \`${msg.guild.commandPrefix}pubranks add role\`.`);
        }
    }
};
