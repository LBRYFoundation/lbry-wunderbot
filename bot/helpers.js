let config = require('config');
let permRanks = config.get('moderation');
let speechChannels = config.get('speechbot');

// Checks if user is allowed to use a command only for mods/team members
exports.hasPerms = function(msg){
if(msg.member.roles.some(r=>permRanks.perms.includes(r.name)) ) {
  return true;
} else {
  return false;
}
}

exports.hasSpeechChannels = function(msg){
console.log(msg.channel.id)
console.log(msg)
if(speechChannels.channelsIDs.includes(msg.channel.id) ) {
  return true;
} else {
  return false;
}
}
