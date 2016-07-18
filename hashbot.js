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
    }, 3600000);
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
  needle.get('https://explorer.lbry.io/api/getmininginfo', function(error, response) {
    if (error || response.statusCode !== 200) {
      slackbot.postMessage(channel, 'Explorer API is not available');
    }
    else {
      var data = response.body,
          hashrate = Math.round(data.networkhashps / 1000000000),
          difficulty = numberWithCommas(Math.round(data.difficulty)),
          block = numberWithCommas(data.blocks);

      slackbot.postMessage(channel,
        // 'Blockchain stats:\n' +
        'Hashrate: ' + hashrate + ' GH/s\n' +
        'Difficulty: ' + difficulty + '\n' +
        'Current block: ' + block + '\n' +
        '_Source: https://explorer.lbry.io_'
      );
    }
  });
}


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
