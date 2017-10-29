var needle = require('needle');
var ChannelID = "363049669636390913"	
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
	bot.channels.get(ChannelID).send(
        // 'Blockchain stats:\n' +
        'Hashrate: ' + hashrate + '\n' +
        'Difficulty: ' + difficulty + '\n' +
        'Current block: ' + height + '\n' +
        '_Source: https://explorer.lbry.io_'
      );
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
	if(!inPrivateOrBotSandbox(msg)){
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

      msg.channel.send(
        // 'Blockchain stats:\n' +
        'Hashrate: ' + hashrate + '\n' +
        'Difficulty: ' + difficulty + '\n' +
        'Current block: ' + height + '\n' +
        '_Source: https://explorer.lbry.io_'
      );
    }
  });
}

function inPrivateOrBotSandbox(msg){
  if((msg.channel.type == 'dm') || (msg.channel.id === ChannelID)){
    return true;
  }else{
    return false;
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


    }
}
