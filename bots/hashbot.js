var needle = require('needle');

var command = '!hash';

module.exports={
  command: command,
  init: init,
  respond: respond
};


function init(slackbot, channel) {
  if (channel) {
    setInterval(function() {
      sendMiningInfo(slackbot, channel);
    }, 6 * 60 * 60 * 1000);
//    sendMiningInfo(slackbot, channel);
  }
}


function respond(slackbot, data) {
  var words = data.text.trim().split(' ');

  if (words[0] !== command) {
    // wtf?
    return;
  }

  if (words.length > 1) {
    // e.g. "!hash and some other words"
    return;
  }

  sendMiningInfo(slackbot, data.channel);
}


function sendMiningInfo(slackbot, channel) {
  needle.get('https://explorer.lbry.io/api/v1/status', function(error, response) {
    if (error || response.statusCode !== 200) {
      slackbot.postMessage(channel, 'Explorer API is not available');
    }
    else {
        var data, hashrate = "", difficulty = "", height = "";
        data =  response.body;
        height += data.status.height;
        hashrate += data.status.hashrate;
        difficulty += data.status.difficulty;

      slackbot.postMessage(channel,
        // 'Blockchain stats:\n' +
        'Hashrate: ' + hashrate + '\n' +
        'Difficulty: ' + difficulty + '\n' +
        'Current block: ' + height + '\n' +
        '_Source: https://explorer.lbry.io_'
      , {icon_emoji: ':miner:'});
    }
  });
}


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
