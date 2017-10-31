let needle = require('needle');
let config = require('config');
let hasHashBotChannels = require('../helpers.js').hasHashBotChannels;
let inPrivate = require('../helpers.js').inPrivate;
let ChannelID = config.get('hashbot').mainchannel;	
exports.commands = [
	"hash" // command that is in this file, every command needs it own export as shown below
]

exports.custom = [
    "timedhash"
]

exports.timedhash = function(bot) {
    setInterval(function() {
      sendMiningInfo(bot);
    }, 6 * 60 * 60 * 1000);
	
	function sendMiningInfo(bot) {
  needle.get('https://explorer.lbry.io/api/v1/status', function(error, response) {
    if (error || response.statusCode !== 200) {
      bot.channels.get(ChannelID).send('Explorer API is not available');
    } else {
        var data, hashrate = "", difficulty = "", height = "";
        data = response.body;
        height += data.status.height;
        hashrate += data.status.hashrate;
        difficulty += data.status.difficulty;
	description = "Hashrate: "+hashrate+"\n"+"Difficulty: "+difficulty+"\n"+"Current block: "+height+"\n"+"Source: https://explorer.lbry.io";
	const embed = {
	  "description": description,
	  "color": 7976557,
	  "author": {
	    "name": "LBRY Explorer Stats",
	    "url": "https://explorer.lbry.io",
	    "icon_url": "https://i.imgur.com/yWf5USu.png"
	  }
	};
	bot.channels.get(ChannelID).send({ embed });
    }
  });
}
}


exports.hash = {
	usage: "",
	description: 'Displays current Hashrate of Network',
	process: function(bot,msg){
  var command = '!hash';
  sendMiningInfo(bot, msg);


function sendMiningInfo(bot, msg) {
	if(!inPrivate(msg) && !hasHashBotChannels(msg)){
    msg.channel.send('Please use <#' + ChannelID + '> or DMs to talk to hash bot.');
    return;
  }
  needle.get('https://explorer.lbry.io/api/v1/status', function(error, response) {
    if (error || response.statusCode !== 200) {
      msg.channel.send('Explorer API is not available');
    }
    else {
        var data, hashrate = "", difficulty = "", height = "";
        data = response.body;
        height += data.status.height;
        hashrate += data.status.hashrate;
        difficulty += data.status.difficulty;
	description = "Hashrate: "+hashrate+"\n"+"Difficulty: "+difficulty+"\n"+"Current block: "+height+"\n"+"Source: https://explorer.lbry.io";
	const embed = {
	  "description": description,
	  "color": 7976557,
	  "author": {
	    "name": "LBRY Explorer Stats",
	    "url": "https://explorer.lbry.io",
	    "icon_url": "https://i.imgur.com/yWf5USu.png"
	  }
	};
	msg.channel.send({ embed });    
    }
  });
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


    }
}
