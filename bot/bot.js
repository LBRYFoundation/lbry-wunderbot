'use strict';

// Load up libraries
const { Client, Intents } = require('discord.js');
const neededIntents = new Intents(32767);
// Load config!
let config = require('config');
config = config.get('bot');
let genconfig = require('config');
//load modules
const commandsV2 = require('./modules/commandsV2.js');

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
      m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. WebSocket Latency is ${bot.ws.ping}ms`);
      if (suffix) {
        msg.channel.send('note that !ping takes no arguments!');
      }
    }
  }
};

const bot = new Client({ intents: [neededIntents] });

bot.on('ready', function() {
  console.log('Logged in! Serving in ' + bot.guilds.cache.size + ' servers');
  require('./plugins.js').init();
  console.log('type ' + config.prefix + 'help in Discord for a commands list.');
  bot.user.setActivity(config.prefix + 'help', { type: 'LISTENING' });

  //initialize the commandsBot
  commandsV2.init(bot);
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
    let cmdTxt = msg.content.split(' ')[0].substring(config.prefix.length);
    let suffix = msg.content.substring(cmdTxt.length + config.prefix.length + 1); //add one for the ! and one for the space
    if (msg.mentions.has(bot.user)) {
      try {
        cmdTxt = msg.content.split(' ')[1];
        suffix = msg.content.substring(bot.user.mention().length + cmdTxt.length + config.prefix.length + 1);
      } catch (e) {
        //no command
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
    if (msg.author === bot.user) {
      return;
    }
    if (msg.author !== bot.user && msg.mentions.has(bot.user.id)) {
      if (msg.content.includes('@here') || msg.content.includes('@everyone')) {
        return;
      }
      msg.channel.send('yes?'); //using a mention here can lead to looping
    } else {
    }
  }
}

bot.on('messageCreate', msg => checkMessageForCommand(msg, false));
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
