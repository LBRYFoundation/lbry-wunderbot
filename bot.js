var SlackBot = require('slackbots');
var needle = require('needle');

var SLACK_TOKEN = process.env.SLACK_TOKEN;
var CHANNEL = process.env.CHANNEL;

if (!SLACK_TOKEN) {
    throw new Error('SLACK_TOKEN env var required');
}

var bot = new SlackBot({
    token: SLACK_TOKEN,
    name: 'hashbot'
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getData() {
    needle.get('https://explorer.lbry.io/api/getmininginfo', function(error, response) {
        // if (!error && response.statusCode == 200) {
        //     console.log(response.body);
        // }

        var data = response.body,
            hashrate = Math.round(data.networkhashps / 1000000000),
            difficulty = numberWithCommas(Math.round(data.difficulty)),
            block = numberWithCommas(data.blocks);

        bot.postMessageToChannel(CHANNEL,
            // 'Blockchain stats:\n' +
            'Hashrate: ' + hashrate + ' GH/s\n' +
            'Difficulty: ' + difficulty + '\n' +
            'Current block: ' + block + '\n' +
            '_Source: https://explorer.lbry.io_'
        );

    });
}

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    bot.on('message', function(data) {
        if (data.text && data.text.trim() === '!hash') {
            getData();
        }
    });

    // Post every hour
    setInterval(getData, 3600000);
    getData();
});