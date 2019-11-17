const discordIRC = require('discord-irc').default;
const config = require('config');
const ircconfig = config.get('irc');
exports.custom = ['irc'];

exports.irc = function(bot) {
  if (ircconfig.enabled) {
    discordIRC([ircconfig]);
  }
};
