let config = require('config');
let permRanks = config.get('moderation');
let speechBotChannels = config.get('speechbot');
let priceBotChannels = config.get('pricebot');
let ExcludedSpam = config.get('spamdetection');
let hashBotChannels = config.get('hashbot');

// Checks if user is allowed to use a command only for mods/team members
exports.hasPerms = function(msg){
if(msg.member.roles.some(r=>permRanks.perms.includes(r.name)) ) {
  return true;
} else {
  return false;
}
}

// Check if command was sent in dm
exports.inPrivate = function(msg){
  if((msg.channel.type == 'dm')){
    return true;
  }else{
    return false;
  }
}

// Checks if Message was sent from a channel in speechBot Channels list
exports.hasSpeechBotChannels = function(msg){
if(speechBotChannels.channels.includes(msg.channel.id) ) {
  return true;
} else {
  return false;
}
}

// Checks if Message was sent from a channel in priceBot Channels list
exports.hasPriceBotChannels = function(msg){
if(priceBotChannels.channels.includes(msg.channel.id) ) {
  return true;
} else {
  return false;
}
}

// Checks if Message was sent from a Excluded channel
exports.hasExcludedSpamChannels = function(msg){
if(ExcludedSpam.channels.includes(msg.channel.id) ) {
  return true;
} else {
  return false;
}
}

// Checks if Message was sent from a Excluded user
exports.hasExcludedSpamUsers = function(msg){
if(ExcludedSpam.users.includes(msg.author.id) ) {
  return true;
} else {
  return false;
}
}

// Checks if Message was sent from a channel in hashBot Channels list
exports.hasHashBotChannels = function(msg){
if(hashBotChannels.channels.includes(msg.channel.id) ) {
  return true;
} else {
  return false;
}
}
