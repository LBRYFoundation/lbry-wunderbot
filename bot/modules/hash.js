var needle = require('needle');

exports.commands = [
	"hash" // command that is in this file, every command needs it own export as shown below
]

exports.custom = [
    "timedhash"
]

exports.timedhash = function(bot) {
    setInterval(function() {
      sendMiningInfo(bot, msg);
    }, 6 * 60 * 60 * 1000);
}


exports.hash = {
	usage: "",
	description: 'Displays current Hashrate of Network',
	process: function(bot,msg){
		
  var command = '!hash';
  sendMiningInfo(bot, msg);


function sendMiningInfo(bot, msg) {
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


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
  
    }
}
