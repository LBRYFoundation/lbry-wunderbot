let config = require('config');
let botconfig = config.get('bot');
let rolelist = config.get('rolelist');

exports.commands = [
  'addrole', // command that is in this file, every command needs it own export as shown below
  'delrole',
  'roles'
];

exports.addrole = {
  usage: '<role>',
  description: 'Adds you to specified role',
  process: function(bot, msg, suffix) {
    //rolelist.allowedroles = rolelist.allowedroles.map(v => v.toLowerCase());
    // Here the bot,msg and suffix is avaible, this function can be async if needed.
    let newrole = msg.guild.roles.find('name', suffix);
    let baserole = msg.guild.roles.find('name', rolelist.baserole);
    // Checks if the user put a role in the message.
    if (suffix) {
      //suffix = suffix.toLowerCase();
      // Checks if the role mentioned in the message is in the allowed roles listed in the wunderbot config.
      if (rolelist.allowedroles.includes(suffix) || rolelist.baserole.includes(suffix)) {
        // Checks if the role even exists in the discord server
        if (newrole !== null) {
          // Checks if the member has the role that they are trying to add
          if (!msg.member.roles.find('name', suffix)) {
            msg.member.addRole(newrole).then(msg.channel.send(msg.member + ' has been added to the ' + suffix + ' role!'));
            if (rolelist.baserole !== ' ') {
              if (baserole !== null) {
		// Checks if Member has the baserole, and also checks if they just added the baserole
                if (!msg.member.roles.find('name', rolelist.baserole) && suffix !== rolelist.baserole) {
                  msg.member.addRole(baserole).then(msg.channel.send(msg.member + ' has been added to the ' + rolelist.baserole + ' role!'));
                }
              } else {
                msg.channel.send('The ' + rolelist.baserole + " Role doesn't exist. Please add that role first!");
              }
            }
          } else {
            msg.channel.send('It seems that you already have that role! Try removing it first with the ' + botconfig.prefix + 'delrole command!');
          }
        } else {
          msg.channel.send('The role ' + '`' + suffix + '`' + ' does not exist!');
        }
      } else {
        msg.channel.send("That role isn't one you can add yourself to! Please run the " + botconfig.prefix + 'roles command to find out which ones are allowed.');
      }
    } else {
      msg.channel.send('Please specify a role. Type ' + botconfig.prefix + 'roles to see which you may add!');
    }
  }
};
exports.delrole = {
  usage: '<role>',
  description: 'Deletes the specified role from your account',
  process: function(bot, msg, suffix) {
    // Here in the bot, msg and suffix are available, this function can be async if needed.
    let oldrole = msg.guild.roles.find('name', suffix);
    // Checks if the user put a role in the message.
    if (suffix) {
      // Checks if the role mentioned in the message is in the allowed roles listed in the Wunderbot config.
      if (rolelist.allowedroles.includes(suffix)) {
        // Checks if the role exists in the Discord server
        if (oldrole !== null) {
          // Checks if the member has the role that they are trying to add
          if (msg.member.roles.find('name', suffix)) {
            msg.member.removeRole(oldrole).then(msg.channel.send(msg.member + ' has been removed from the ' + suffix + ' role!'));
          } else {
            msg.channel.send("You don't seem to have that role! Try adding it first with the " + botconfig.prefix + 'addrole command!');
          }
        } else {
          msg.channel.send('The role ' + '`' + suffix + '`' + ' does not exist!');
        }
      } else {
        msg.channel.send("That role isn't one you can add yourself to! Please run the " + botconfig.prefix + 'roles command to find out which ones are allowed.');
      }
    } else {
      msg.channel.send('Please specify a role. Type ' + botconfig.prefix + 'roles to see which you may add!');
    }
  }
};
exports.roles = {
  usage: '',
  description: 'displays roles you can give yourself',
  process: function(bot, msg, suffix) {
    // Here in the bot, msg and suffix are available, this function can be async if needed.
    msg.channel.send({
      embed: {
        color: 3447003,
        title: 'Wunderbot',
        description: 'You have accessed the rolebot function of Wunderbot!',
        fields: [
          {
            name: 'List of roles',
            value: buildRoleString(rolelist.allowedroles) + '`' + rolelist.baserole + '`',
            inline: false
          },
          {
            name: 'How to add a role to yourself',
            value: '!addrole (role) - Adds a specified role to yourself.\n!addrole International would add the International role.',
            inline: false
          },
          {
            name: 'How to remove a role from yourself',
            value: '!delrole (role) - Removed a specified role from yourself.\n!delrole International would remove the International role.',
            inline: false
          },
          {
            name: 'NOTE',
            value: 'The above roles are case sensitive. The LBRYian role will be auto-added when you chose any of the available roles',
            inline: false
          }
        ],
        footer: {
          icon_url: msg.author.avatarURL,
          text: 'Requested by: ' + JSON.stringify(msg.author.username)
        }
      }
    });
    //msg.channel.send(JSON.stringify(rolelist.allowedroles));
  }
};

function buildRoleString(roles) {
  let str = '';
  for (let i = 0; i < roles.length; i++) {
    str += '`' + roles[i] + '`' + '\n';
  }
  return str;
}
