"use strict";
//let config = require("config");
//let rolelist = config.get("rolelist");
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
let checkForCommand = function (message) {
    //if the close command is found
    if (!message.author.bot && message.content.toLowerCase().indexOf('!close') >= 0) {
        //send the -close command twice with a 4 seconds timeout
        message.channel.send("-close").catch(console.error);
        setTimeout(() => {
            message.channel.send("-close").catch(console.error);
        }, 4000);
    }
};