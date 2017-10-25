let config = require('config');
let permRanks = config.get('moderation');

// Checks if user is allowed to use a command only for mods/team members
exports.hasPerms = function(msg){
if(message.member.roles.some(r=>permRanks.perms.includes(r.name)) ) {
  return true;
} else {
  return false;
}
}