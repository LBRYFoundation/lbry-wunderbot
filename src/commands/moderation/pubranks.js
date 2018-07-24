import { Command } from "discord.js-commando";
import { RichEmbed } from "discord.js";
import { oneLine } from "common-tags";

module.exports = class PubRanksCommand extends Command {
    constructor(client) {
        super(client, {
            name: "pubranks",
            aliases: ["editranks", "editroles", "pubrank", "editroleme"],
            group: "moderation",
            memberName: "pubranks",
            description: "Manages a server's public roles.",
            details: oneLine`
      Do you want to have an opt-in only NSFW channel? A role that you can ping to avoid pinging everyone?
      This command allows for management of a server's public roles.
      Note: Adding and removing public roles must be done by someone with the MANAGE_ROLES permission.
			`,
            examples: ["pubranks add ping"],
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
        if (args.action.toLowerCase() === "add") {
            if (!msg.guild.member(msg.author).hasPermission("MANAGE_ROLES", false, true, true)) return msg.reply(`You do not have permission to perform this action! Did you mean \`${msg.guild.commandPrefix}rank give\`?`);
            const guildRanks = await msg.guild.settings.get("ranks", []);
            const rankToAdd = msg.guild.roles.find("name", args.rank);
            if (rankToAdd === null) return msg.reply("That is not a role! Was your capatalization and spelling correct?");
            guildRanks.push(args.rank);
            await msg.guild.settings.set("ranks", guildRanks);
            msg.reply("Role added.");
        } else if (args.action.toLowerCase() === "remove" || args.action.toLowerCase() === "delete") {
            if (!msg.guild.member(msg.author).hasPermission("MANAGE_ROLES", false, true, true)) return msg.reply(`You do not have permission to perform this action! Did you mean\`${msg.guild.commandPrefix}rank take\`?`);
            const guildRanks = await msg.guild.settings.get("ranks", []);
            const rankIndex = guildRanks.indexOf(args.rank);
            const rankToRemove = msg.guild.roles.find("name", args.rank);
            if (rankToRemove === null) return msg.reply("That is not a role! Was your capatalization and spelling correct?");
            guildRanks.splice(rankIndex, 1);
            msg.reply("Role removed.");
            -(await msg.guild.settings.set("ranks", guildRanks));
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
**NOTE:** If you are trying to give yourself a role, do \`${msg.guild.commandPrefix}rank give role\`.`);
        }
    }
};
