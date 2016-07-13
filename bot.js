//Please note that this was quickly made and it just works, if you would like to improve it just do a pull and i´ll check it //Fillerino
var SlackBot = require('slackbots');
var needle = require('needle');

var bot = new SlackBot({
    token: '>>>>TOKEN<<<<', // Add a bot https://my.slack.com/services/new/bot and put the token  
    name: 'hashbot'
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage 
    bot.on('message', function(data) {
        msg = data.text;
        if (msg.indexOf('!hash') >= 0) {
            getdata();
        }
    });

    function getdata() {
        needle.get('https://explorer.lbry.io/api/getnetworkhashps', function(error, response) {
            if (!error && response.statusCode == 200)
                console.log(response.body);
            currenthash = response.body / 1000000000
                //Gets current Diff
            needle.get('https://explorer.lbry.io/api/getdifficulty', function(error, response) {
                if (!error && response.statusCode == 200)
                    console.log(response.body);
                currentdiff = numberWithCommas(Math.round(response.body));
                //Gets current block
                needle.get('https://explorer.lbry.io/api/getblockcount', function(error, response) {
                    if (!error && response.statusCode == 200)
                        console.log(response.body);
                    var currentblock = numberWithCommas(response.body);
                    //bot.postMessageToChannel('mining', '*Current stats: *' + os.EOL + '*Hashrate: ' + Math.round(currenthash) + ' GH/s*' + os.EOL + '*Difficulty: ' + currentdiff + os.EOL + '*' + '*Current block: ' + currentblock + os.EOL + '*' + '_You can see this data and much more on the official explorer https://explorer.lbry.io!_');
                    bot.postMessageToChannel('mining', '*Current stats:*\n' + '*Hashrate: ' + Math.round(currenthash) + ' GH/s*\n' + '*Difficulty: ' + currentdiff + '*\n' + '*Current block: ' + currentblock + '*\n' + '_You can see this data and much more on the official explorer https://explorer.lbry.io!_');
                });


            });

        });
    }

    //Hour interval posting
    setInterval(getdata, 3600000);
    getdata();
    //
});