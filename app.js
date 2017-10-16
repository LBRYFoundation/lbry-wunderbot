var SlackBot = require('slackbots');
var request = require('request');
var fs = require('fs');
var path = require('path');

['SLACK_TOKEN'].forEach(function (envVar) {
  if (!process.env[envVar]) {
    throw new Error(envVar + ' env var required');
  }
});

var slackbot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: 'ai'
});


function sendWelcomeMessage(user) {
  fs.readFile(path.join(path.dirname(require.main.filename), 'slack-greeting.md'), {encoding: 'utf-8'}, function (error, data) {
    if (!error) {
      slackbot.postMessage(user, data);
    }
  });
};

var hashbot = require('./bots/hashbot');
hashbot.init(slackbot, process.env.GENERAL_CHANNEL);

var pricebot = require('./bots/pricebot');
pricebot.init(process.env.GENERAL_CHANNEL);

var speechbot = require('./bots/speechbot');
speechbot.init(process.env.GENERAL_CHANNEL);

var statbot = require('./bots/statbot');
statbot.init(process.env.GENERAL_CHANNEL);

slackbot.on('start', function() {
  slackbot.on('message', function(data) {
    if (data.type == 'team_join') {
      setTimeout(function() { sendWelcomeMessage(data.user.id); }, 2000); //Delay because of slow slack api updates which sometimes does not send msg.
    }
    if (data.text) {
//      gifbot.handle_msg(data.text, data.channel);

      var command = data.text.trim().split(' ')[0];

      if (command === '!help') {
        var helpMsg = "I'm Wunderbot, LBRY's slackbot. Here's what I can do:\n" +
          '`!help` shows this message\n' +
          '`!stats` shows market stats in trading channel\n' +
          '`!price` works only in PM now\n' +
          '`!hash` reports on the LBRY blockchain\n' +
          '_type any of the above commands for more info_\n' +
          '\n' +
          'My code is at https://github.com/lbryio/lbry-wunderbot. I love learning new tricks.\n';

        slackbot.postMessage(data.channel, helpMsg, {icon_emoji: ':bulb:'});
      }

      if (command === hashbot.command) {
        hashbot.respond(slackbot, data);
      }
	  if (command === speechbot.command) {
        speechbot.respond(slackbot, data);
      }
      if (command === pricebot.command) {
        pricebot.respond(slackbot, data);
      }
       if (command === statbot.command) {
        statbot.respond(slackbot, data);
      }
    }
  });
});
