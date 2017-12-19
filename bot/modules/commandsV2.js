"use strict";
let commands = require("../../config/commands");
const Discord = require("discord.js");
let initialized = false;
let discordBot = null;

module.exports = {
  init: init
};

function init(discordBot_) {
  if (initialized) {
    throw new Error("init was already called once");
  }

  discordBot = discordBot_;

  discordBot.on("message", checkForCommand);
}

/**
 *
 * @param {String} message
 */
let checkForCommand = function(message) {
  Object.keys(commands).forEach(command => {
    if (
      !message.author.bot &&
      message.content.toLowerCase().indexOf(command.toLowerCase()) >= 0 &&
      commands[command].operation === "send"
    ) {
      message.channel.send("", new Discord.RichEmbed(commands[command].bundle));
    }
  });
};
