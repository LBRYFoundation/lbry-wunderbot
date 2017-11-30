let config = require("config");
let permRanks = config.get("moderation");
let speechBotChannels = config.get("speechbot");
let priceBotChannels = config.get("pricebot");
let ExcludedSpam = config.get("spamdetection");
let hashBotChannels = config.get("hashbot");
let statsBotChannels = config.get("statsbot");

// Checks if user is allowed to use a command only for mods/team members
exports.hasPerms = function(msg) {
  return msg.member.roles.some(r => permRanks.perms.includes("LBRY TEAM","LBRY MOD"));
};

// Check if command was sent in dm
exports.inPrivate = function(msg) {
  return msg.channel.type == "dm";
};

// Checks if Message was sent from a channel in speechBot Channels list
exports.hasSpeechBotChannels = function(msg) {
  return speechBotChannels.channels.includes(msg.channel.id);
};

// Checks if Message was sent from a channel in priceBot Channels list
exports.hasPriceBotChannels = function(msg) {
  return priceBotChannels.channels.includes(msg.channel.id);
};

// Checks if Message was sent from a Excluded channel
exports.hasExcludedSpamChannels = function(msg) {
  return ExcludedSpam.channels.includes(msg.channel.id);
};

// Checks if Message was sent from a Excluded user
exports.hasExcludedSpamUsers = function(msg) {
  return ExcludedSpam.users.includes(msg.author.id);
};

// Checks if Message was sent from a channel in hashBot Channels list
exports.hasHashBotChannels = function(msg) {
  return hashBotChannels.channels.includes(msg.channel.id);
};

// Checks if Message was sent from a channel in statsBot Channels list
exports.hasStatsBotChannels = function(msg) {
  retrun(statsBotChannels.channels.includes(msg.channel.id));
};
