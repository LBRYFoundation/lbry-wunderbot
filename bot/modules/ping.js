exports.commands = [
	"ping" // command that is in this file, every command needs it own export as shown below
];

exports.ping = {
    usage: "<No Argument>",
    description: "responds pong, useful for checking if bot is alive",
    process: async function(bot, msg, suffix) {
      let m = await msg.channel.send(msg.author + " Ping?");
      m.edit(
        msg.author + ` Pong! Latency is ${m.createdTimestamp -
          msg.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`
      );
      if (suffix) {
        msg.channel.send("note that !ping takes no arguments!");
      }
    }
  };
