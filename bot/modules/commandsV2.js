'use strict';
let commands = require('../../config/commands');
let commandsVerify = require('../../config/verify')
const Discord = require('discord.js');
let initialized = false;
let discordBot = null;
let commandsList = null;
let commandsVerifyList = null;

module.exports = {
  init: init
};

function init(discordBot_) {
  if (initialized) {
    throw new Error('init was already called once');
  }

  discordBot = discordBot_;

  discordBot.on('message', checkForCommand);
}

/**
 *
 * @param {String} message
 */
let checkForCommand = function(message) {
  //build the command list ONLY on first run
  let firstRun = false;
  if (commandsList === null) {
    firstRun = true;
    commandsList = '';
  }
  let checkForCommand = function(message) {
  //build the command list ONLY on first run
  let firstRun = false;
  if (commandsVerifyList === null) {
    firstRun = true;
    commandsVerifyList = '';
  }
  //for each message go through all the commands and check if there are any matches
  Object.keys(commands).forEach(command => {
    //if a command is found
    if (!message.author.bot && message.content.toLowerCase().indexOf(command.toLowerCase()) >= 0 && commands[command].operation === 'send') {
      //send a message to the channel according to the config
      message.channel.send('', new Discord.RichEmbed(commands[command].bundle));
    }
  });
     Object.keys(commandsVerify).forEach(command => {
    //if a command is found
    if (!message.author.bot && message.content.toLowerCase().indexOf(command.toLowerCase()) >= 0 && commandsVerify[command].operation === 'send') {
      //send a message to the channel according to the config
      message.channel.send('', new Discord.RichEmbed(commandsVerify[command].bundle));
    }
  });
  if (firstRun) {
    commandsList = Object.keys(commands)
    commandsVerifyList = Object.keys(commandsVerify)
      .sort()
      .join(', ');
  }
  //if the user is requesting the list of commands, then print it
  if (!message.author.bot && message.content.toLowerCase().indexOf('!helpcommands') >= 0) {
    let bundle = commands['!helpcommands'].bundle;
    bundle.description = '**' + commandsList + '**';
    message.channel.send('', new Discord.RichEmbed(bundle));
  }
};
