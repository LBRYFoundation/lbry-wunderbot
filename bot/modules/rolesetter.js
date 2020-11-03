//let config = require('config');
//let botconfig = config.get('bot');
//let rolelist = config.get('rolelist');
//let inPrivate = require('../helpers.js').inPrivate;
//
//exports.commands = [
//  'addrole', // command that is in this file, every command needs it own export as shown below
//  'delrole',
//  'roles'
//];
//
//exports.addrole = {
//  usage: '<role>',
//  description: 'Adds you to specified role',
//  process: function(bot, msg, suffix) {
//    // Provide shortened syntax for the sake of code cleanliness
//    let send = msgTxt => msg.channel.send(msgTxt);
//    // Checks if the user has messaged the bot via Direct Message
//    if (inPrivate(msg)) return send('You can not set roles in DMs! Please go to the Discord server to do this.');
//
//    // Here the bot, msg and suffix is avaible, this function can be async if needed.
//    // Make sure to eliminate case sensitivity, do this here to only perform the sweep once.
//    let newrole = msg.guild.roles.find(role => role.name.toLowerCase() === suffix.toLowerCase());
//    // Baserole is assumed to already be case accurate as it's handled in the config itself.
//    let baserole = msg.guild.roles.find(item => item.name === rolelist.baserole);
//
//    let rolecmd = botconfig.prefix + 'roles';
//
//    // Checks if the user included a role in their message
//    if (!suffix) return send('Please specify a role. Type ' + rolecmd + ' to see which you may add yourself!');
//    // Checks if there is a matching role found on the server
//    if (!newrole) return send('The role specified `' + suffix + '` does not exist on this server!');
//    // Checks that the allowed roles and base role against the matched role's name, since this eliminates case sensitivity issues
//    if (!rolelist.allowedroles.includes(newrole.name) && !rolelist.baserole.includes(newrole.name)) return send("That role isn't one you can add yourself to! Type " + rolecmd + ' command to find out which ones are allowed.');
//    // Use the matched name to check against the member's existing roles
//    if (msg.member.roles.find(item => item.name === newrole.name)) return send('It seems you already have the ' + newrole.name + ' role');
//
//    // Assuming all these factors succeed, add the role
//    msg.member.addRole(newrole).then(send(msg.member + ' has been added to the ' + newrole.name + ' role!'));
//
//    // Check if a baserole is actually set
//    if (!rolelist.baserole) return;
//    // Confirm that the role exists on the server and if not then be sure to send a nag message
//    if (!baserole) return send('The base role of ' + rolelist.baserole + ' has been set in config but is missing from the server');
//    // Checks if the new role being added is the same as the baserole, then skips the messages below if this is the case.
//    if (newrole == baserole) return;
//    // Confirm if the user has the baserole already, including if it was added just now
//    if (msg.member.roles.find(item => item.name === baserole.name)) return;
//    // Add the base role and avoid spamming the user by only mentioning them in the previous message
//    msg.member.addRole(baserole).then(send('We also added the base ' + rolelist.baserole + ' role for you!'));
//  }
//};
//exports.delrole = {
//  usage: '<role>',
//  description: 'Deletes the specified role from your account',
//  process: function(bot, msg, suffix) {
//    // Provide shortened syntax for the sake of code cleanliness
//    let send = msgTxt => msg.channel.send(msgTxt);
//    // Checks if the user has messaged the bot via Direct Message
//    if (inPrivate(msg)) return send('You can not set roles in DMs! Please go to the Discord server to do this.');
//    // Here in the bot, msg and suffix are available, this function can be async if needed.
//    // Make sure to eliminate case sensitivity, do this here to only perform the sweep once.
//    let oldrole = msg.guild.roles.find(role => role.name.toLowerCase() === suffix.toLowerCase());
//    let rolecmd = botconfig.prefix + 'roles';
//    // Checks if the user included a role in their message
//    if (!suffix) return send('Please specify a role. Type ' + rolecmd + ' to see which you may remove yourself!');
//    // Checks if there is a matching role found on the server
//    if (!oldrole) return send('The role specified `' + suffix + '` does not exist on this server!');
//    // Checks that the allowed roles against the matched role's name, since this eliminates case sensitivity issues
//    if (!rolelist.allowedroles.includes(oldrole.name)) return send("That role isn't one you can remove yourself! If you need it removed, please ask a moderator!");
//    // Use the matched name to check against the member's existing roles
//    if (!msg.member.roles.find(item => item.name === oldrole.name)) return send("It seems you don't actually have the " + oldrole.name + ' role! Mission accomplished!');
//
//    // Assuming all these factors succeed, add the role
//    msg.member.removeRole(oldrole).then(send(msg.member + ' has been removed from the ' + oldrole.name + ' role!'));
//  }
//};
//exports.roles = {
//  usage: '',
//  description: 'displays roles you can give yourself',
//  process: function(bot, msg, suffix) {
//    let send = msgTxt => msg.channel.send(msgTxt);
//    if (inPrivate(msg)) return send('You can not set roles in DMs! Please go to the Discord server to do this.');
//    else {
//      // Here in the bot, msg and suffix are available, this function can be async if needed.
//      send({
//        embed: {
//          color: 3447003,
//          title: 'Wunderbot',
//          description: 'You have accessed the rolebot function of Wunderbot!',
//          fields: [
//            {
//              name: 'List of roles',
//              value: buildRoleString(rolelist.allowedroles) + '`' + rolelist.baserole + '`',
//              inline: false
//            },
//            {
//              name: 'How to add a role to yourself',
//              value: '!addrole (role) - Adds a specified role to yourself.\n!addrole International would add the International role.',
//              inline: false
//            },
//            {
//              name: 'How to remove a role from yourself',
//              value: '!delrole (role) - Removed a specified role from yourself.\n!delrole International would remove the International role.',
//              inline: false
//            },
//            {
//              name: 'NOTE',
//              value: 'The LBRY-Curious role will be auto-added when you chose any of the available roles',
//              inline: false
//            }
//          ],
//          footer: {
//            icon_url: msg.author.avatarURL,
//            text: 'Requested by: ' + JSON.stringify(msg.author.username)
//          }
//        }
//      });
//    }
//  }
//};
//
//function buildRoleString(roles) {
//  let str = '';
//  for (let i = 0; i < roles.length; i++) {
//    str += '`' + roles[i] + '`' + '\n';
//  }
//  return str;
//}
