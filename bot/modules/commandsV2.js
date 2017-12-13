'use strict';
let commands = require("../../config/commands");
const Discord = require("discord.js");
let initialized = false;

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
let checkForCommand = function (message) {
    Object.keys(commands).forEach(command => {
        if (message.indexOf(command) && commands[command].operation === 'send') {
            msg.channel.send(commands[command].bundle);
        }
    });
}