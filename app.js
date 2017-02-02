var SlackBot = require('slackbots');
var request = require('request');
var fs = require('fs');
var path = require('path');

['SLACK_TOKEN', 'RPCUSER', 'RPCPASSWORD', 'MONGODB_URL'].forEach(function (envVar) {
  if (!process.env[envVar]) {
    throw new Error(envVar + ' env var required');
  }
});

var slackbot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: 'wunderbot'
});


function sendWelcomeMessage(user) {
  fs.readFile(path.join(path.dirname(require.main.filename), 'slack-greeting.md'), {encoding: 'utf-8'}, function (error, data) {
    if (!error) {
      slackbot.postMessage(user, data);
    }
  });
};

var tipbot = require('./bots/tipbot');
tipbot.init(process.env.RPCUSER, process.env.RPCPASSWORD);

var hashbot = require('./bots/hashbot');
hashbot.init(slackbot, process.env.MINING_CHANNEL);

var claimbot = require('./bots/claimbot');
claimbot.init(slackbot, process.env.CLAIMS_CHANNEL, process.env.RPCUSER, process.env.RPCPASSWORD, process.env.MONGODB_URL);

slackbot.on('start', function() {
  slackbot.on('message', function(data) {
    if (data.type == 'team_join') {
      setTimeout(function() { sendWelcomeMessage(data.user.id); }, 2000); //Delay because of slow slack api updates which sometimes does not send msg.
    }
    if (data.text) {
//      gifbot.handle_msg(data.text, data.channel);

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
