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
        var data, k, hashrate = "Hash Rate: ";
        data =  response.body;
        var data2, k, difficulty = "Difficulty: ";
        data2 =  response.body;
        var data3, k, height = "Current Block: ";
        data3 =  response.body;
        data.status[0] =  "";

        for (k in data.status.hashrate) {
            hashrate += data.status.hashrate[k];
        }
        data2.status[0] = "";

        for (k in data2.status.difficulty) {
            difficulty += data2.status.difficulty[k];
        }
        data3.status[0] = "";

        for (k in data3.status.height) {
            height += data3.status.height[k];
        }

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
