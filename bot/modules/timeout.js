let config = require("config");
let hasPerms = require("../helpers.js").hasPerms;
let botlog = config.get("moderation").logchannel;
exports.commands = ["timeout"];

exports.timeout = {
  usage: "<@user> <Time-in-Min.>",
  description: "timeout a user for a given time in <minutes>",
  process: function(bot, msg, suffix) {
    if (!hasPerms(msg)) {
      return;
    }
    var words = suffix
      .trim()
      .split(" ")
      .filter(function(n) {
        return n !== "";
      });
    var time = words[1];
    var role = msg.guild.roles.find("name", "timeout");
    var member = msg.mentions.members.first();
    member.addRole(role).catch(console.error);
    bot.channels
      .get(botlog)
      .send(
        "User **" +
          member.toString() +
          "** has been placed in timeout for **" +
          time +
          "** minutes."
      );
    let timeSec = time * 1000 * 60;
    setTimeout(function() {
      member.removeRole(role);
    }, timeSec);
  }
};
