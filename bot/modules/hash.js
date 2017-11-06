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
	description: 'Displays current Hashrate of Network\n**!hash power <Mh/s>**\n  Displays potential Earnings For Given Hashrate in Mh/s',
	process: function(bot,msg,suffix){
  var command = '!hash';
  words = suffix.trim().split(' ').filter( function(n){return n !== "";} );
  profitcommand = words[0];
  myhashrate = words[1];
  		console.log(suffix)
		if (profitcommand == "power") {
			sendProfitInfo(bot, msg, suffix);
			return
		} else {
			sendMiningInfo(bot, msg, suffix);
			return
		}
  

function sendMiningInfo(bot, msg, suffix) {
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
	return
		}
	});
}

function sendProfitInfo(bot, msg, suffix) {
		needle.get('https://whattomine.com/coins/164.json', function(error, response) {
    if (error || response.statusCode !== 200) {
      msg.channel.send('whattomine API is not available');
    } else {
		words = suffix.trim().split(' ').filter( function(n){return n !== "";} );
		var myhashrate = words[1];
		if (myhashrate == "" || myhashrate == null || myhashrate == undefined || myhashrate == " ") {
		myhashrate = "100";
		}
		var Diff = response.body.difficulty24;
		var myHash = Number(myhashrate)
		var LBC = myHash / 2000 * (1 / (Diff * 2^32) * 386) * 3600
		var LBC24 = myHash / 2000 * (1 / (Diff * 2^32) * 386) * 86400
		var LBC1w = myHash / 2000 * (1 / (Diff * 2^32) * 386) * 604800
		var LBC1m = myHash / 2000 * (1 / (Diff * 2^32) * 386) * 2628000
		var message = "With **" + myHash + " Mh/s** and Average 24 hour Difficulty: **" + Diff.toFixed(0) + "**\n" +
		"You can earn the following amounts of **LBC**: \n" +
		"1 Hour = **" + LBC.toFixed(4) + "** \n" +
		"1 Day = **" + LBC24.toFixed(2) + "** \n" +
		"1 Week = **" + LBC1w.toFixed(4) + "** \n" +
		"1 Month = **" + LBC1m.toFixed(4) + "** \n" 
			const embed = {
			  "description": message,
			  "color": 7976557,
			  "author": {
				"name": "Hashing Power Calculator!",
				"icon_url": "https://i.imgur.com/nKHVQgq.png"
			  }
			};
	msg.channel.send({ embed })
	return
		}
  });
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


}
}
