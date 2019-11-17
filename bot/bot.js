'use strict';

// Load up libraries
const Discord = require('discord.js');
// Load config!
let config = require('config');
config = config.get('bot');
let genconfig = require('config');
//load modules
const claimbot = require('./modules/claimbot.js');
const commandsV2 = require('./modules/commandsV2.js');
const supportbot = require('./modules/supportbot.js');

let aliases;
try {
  aliases = require('./alias.json');
} catch (e) {
  console.log('No aliases defined');
  //No aliases defined
  aliases = {
    test: {
      process: function(bot, msg) {
        msg.channel.send('test');
      }
    }
  };
}
let commands = {
  ping: {
    description: 'responds pong, useful for checking if bot is alive',
    process: async function(bot, msg, suffix) {
      let m = await msg.channel.send(msg.author + ' Ping?');
      m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
      if (suffix) {
        msg.channel.send('note that !ping takes no arguments!');
      }
    }
  }
};

let bot = new Discord.Client();

bot.on('ready', function() {
  console.log('Logged in! Serving in ' + bot.guilds.array().length + ' servers');
  require('./plugins.js').init();
  console.log('type ' + config.prefix + 'help in Discord for a commands list.');
  bot.user.setActivity(config.prefix + 'help', { type: 'LISTENING' }).catch(console.error);

  //initialize the claimbot (content bot)
  if (genconfig.get('claimbot').enabled) {
    claimbot.init(bot);
  }
  //initialize the commandsBot
  commandsV2.init(bot);
  //initialize the support bot
  supportbot.init(bot);
});

process.on('unhandledRejection', err => {
  console.log('unhandledRejection: ' + err);
  process.exit(1); //exit node.js with an error
});

bot.on('disconnected', function() {
  console.log('Disconnected!');
  process.exit(1); //exit node.js with an error
});

bot.on('error', function(error) {
  console.log('error: ' + error);
  process.exit(1); //exit node.js with an error
});

function checkMessageForCommand(msg, isEdit) {
  //check if message is a command
  if (msg.author.id !== bot.user.id && msg.content.startsWith(config.prefix)) {
    //check if user is Online
    if (!msg.author.presence.status || msg.author.presence.status === 'offline' || msg.author.presence.status === 'invisible') {
      msg.author.send('Please set your Discord Presence to Online to talk to the bot!').catch(function(error) {
        msg.channel
          .send(
            msg.author +
              ', Please enable Direct Messages from server members to communicate fully with our bot, ' +
              'it is located in the user setting area under Privacy & Safety tab, ' +
              'select the option allow direct messages from server members'
          )
          .then(msg.channel.send('Please set your Discord Presence to Online to talk to the Bot!'));
        return;
      });
    }
    let cmdTxt = msg.content.split(' ')[0].substring(config.prefix.length);
    let suffix = msg.content.substring(cmdTxt.length + config.prefix.length + 1); //add one for the ! and one for the space
    if (msg.isMentioned(bot.user)) {
      try {
        cmdTxt = msg.content.split(' ')[1];
        suffix = msg.content.substring(bot.user.mention().length + cmdTxt.length + config.prefix.length + 1);
      } catch (e) {
        //no command
        msg.channel.send('Yes?');
        return;
      }
    }
    let cmd = aliases.hasOwnProperty(cmdTxt) ? commands[aliases[cmdTxt]] : commands[cmdTxt];
    let alias = aliases[cmdTxt];
    if (alias) {
      cmd = alias;
    } else {
      cmd = commands[cmdTxt];
    }
    if (cmdTxt === 'help') {
      //help is special since it iterates over the other commands
      if (suffix) {
        let cmds = suffix.split(' ').filter(function(cmd) {
          return commands[cmd];
        });
        let info = '';
        for (let i = 0; i < cmds.length; i++) {
          let cmd = cmds[i];
          info += '**' + config.prefix + cmd + '**';
          let usage = commands[cmd].usage;
          if (usage) {
            info += ' ' + usage;
          }
          let description = commands[cmd].description;
          if (description instanceof Function) {
            description = description();
          }
          if (description) {
            info += '\n\t' + description;
          }
          info += '\n';
        }
        msg.channel.send(info);
      } else {
        msg.author.send('**Available Commands:**').then(function() {
          let batch = '';
          let sortedCommands = Object.keys(commands).sort();
          for (let i in sortedCommands) {
            let cmd = sortedCommands[i];
            let info = '**' + config.prefix + cmd + '**';
            let usage = commands[cmd].usage;
            if (usage) {
              info += ' ' + usage;
            }
            let description = commands[cmd].description;
            if (description instanceof Function) {
              description = description();
            }
            if (description) {
              info += '\n\t' + description;
            }
            let newBatch = batch + '\n' + info;
            if (newBatch.length > 1024 - 8) {
              //limit message length
              msg.author.send(batch);
              batch = info;
            } else {
              batch = newBatch;
            }
          }
          if (batch.length > 0) {
            msg.author.send(batch);
          }
        });
      }
    } else if (cmd) {
      // Add permission check here later on ;)
      console.log('treating ' + msg.content + ' from UserID:' + msg.author + ' || UserName: ' + msg.author.username + ' as command');
      try {
        cmd.process(bot, msg, suffix, isEdit);
      } catch (e) {
        let msgTxt = 'command ' + cmdTxt + ' failed :(';
        if (config.debug) {
          msgTxt += '\n' + e.stack;
        }
        msg.channel.send(msgTxt);
      }
    } else {
      //msg.channel.send(cmdTxt + ' not recognized as a command!').then(message => message.delete(10000));
    }
  } else {
    //message isn't a command or is from us
    //drop our own messages to prevent feedback loops
    if (msg.author == bot.user) {
      return;
    }

    if (msg.author !== bot.user && msg.isMentioned(bot.user)) {
      msg.channel.send('yes?'); //using a mention here can lead to looping
    } else {
    }
  }
}

bot.on('message', msg => checkMessageForCommand(msg, false));
bot.on('messageUpdate', (oldMessage, newMessage) => {
  checkMessageForCommand(newMessage, true);
});

exports.addCommand = function(commandName, commandObject) {
  try {
    commands[commandName] = commandObject;
  } catch (err) {
    console.log(err);
  }
};
exports.addCustomFunc = function(customFunc) {
  try {
    customFunc(bot);
  } catch (err) {
    console.log(err);
  }
};
exports.commandCount = function() {
  return Object.keys(commands).length;
};
bot.login(config.token);
