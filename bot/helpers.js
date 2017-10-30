let config = require('config');
let permRanks = config.get('moderation');
let speechBotChannels = config.get('speechbot');

// Checks if user is allowed to use a command only for mods/team members
exports.hasPerms = function(msg){
if(msg.member.roles.some(r=>permRanks.perms.includes(r.name)) ) {
  return true;
} else {
  return false;
}
}

exports.hasSpeechBotChannels = function(msg){
if(speechBotChannels.channels.includes(msg.channel.id) ) {
  return true;
} else {
  return false;
}
}
