module.exports = async function checkWelcomeEvent(member, client) {
    try {
        if ((await member.guild.settings.get("welcomemsgenabled", false)) && (await member.guild.settings.get("welcomemsg", [])) >= 1) {
            const embeds = await member.guild.settings.get("welcomemsg");
            embeds.forEach(e => member.send({ embed: e }));
        }
    } catch (e) {
        console.log("Could not send help message to a user.");
    }
};
