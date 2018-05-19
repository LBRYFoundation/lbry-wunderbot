import Discord from "discord.js";

module.exports = async function checkCustomCommand(msg, client) {
    if (!msg.guild && !msg.author.bot) return;
    const custmcmds = await msg.guild.settings.get("custmcmds", {});
    Object.keys(custmcmds).forEach(cmd => {
        if (msg.content.toLowerCase().indexOf(cmd.toLowerCase()) >= 0 && custmcmds[cmd].operation === "send") {
            msg.channel.send("", new Discord.RichEmbed(custmcmds[cmd].bundle));
        }
    });
};
