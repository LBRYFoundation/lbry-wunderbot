var SlackBot = require('slackbots');

['SLACK_TOKEN', 'RPCUSER', 'RPCPASSWORD'].forEach(function(envVar) {
  if (!process.env[envVar]) {
    throw new Error(envVar + ' env var required');
  }
});

var slackbot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: 'wunderbot'
});


var tipbot = require('./tipbot');
tipbot.init(process.env.RPCUSER, process.env.RPCPASSWORD);

var hashbot = require('./hashbot');
hashbot.init(slackbot, process.env.MINING_CHANNEL);



slackbot.on('start', function() {
  slackbot.on('message', function(data) {
    if (data.text) {
      var command = data.text.trim().split(' ')[0];

      if (command === hashbot.command) {
        hashbot.respond(slackbot, data);
      }

      if (command === tipbot.command) {
        tipbot.respond(slackbot, data);
      }
    }
  });
});
