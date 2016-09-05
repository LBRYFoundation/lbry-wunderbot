var SlackBot = require('slackbots');
var request = require('request');

['SLACK_TOKEN', 'RPCUSER', 'RPCPASSWORD'].forEach(function(envVar) {
  if (!process.env[envVar]) {
    throw new Error(envVar + ' env var required');
  }
});

var slackbot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: 'wunderbot'
});



function sendWelcomeMessage(usertowelcome) {
  request('https://raw.githubusercontent.com/lbryio/lbry.io/master/posts/other/slack-greeting.md', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      slackbot.postMessage(usertowelcome, body);
    }
  });
};

var tipbot = require('./bots/tipbot');
tipbot.init(process.env.RPCUSER, process.env.RPCPASSWORD);

var hashbot = require('./bots/hashbot');
hashbot.init(slackbot, process.env.MINING_CHANNEL);

var gifbot = require('./bots/gifbot');
gifbot.init(slackbot, process.env.IMGUR_CLIENT_ID);

slackbot.on('start', function() {
  slackbot.on('message', function(data) {
    if (data.type == 'team_join') {
      setTimeout(function() { sendWelcomeMessage(data.user.id); }, 2000); //Delay because of slow slack api updates which sometimes does not send msg.
    }
    if (data.text) {
      gifbot.handle_msg(data.text, data.channel);

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
