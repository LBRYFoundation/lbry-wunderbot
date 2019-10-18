let request = require('request');
let config = require('config');
let hasPerms = require('../helpers.js').hasPerms;
let inPrivate = require('../helpers.js').inPrivate;
let ChannelID = config.get('gitrelease').channel;

exports.commands = [
    'releasenotes' // command that is in this file, every command needs it own export as shown below
];

exports.releasenotes = {
    usage: '<desktop/android>',
    description: 'gets current release notes from GitHub, for either Desktop or Android',
    process: function(bot, msg, suffix) {
        let releaseType = suffix.toLowerCase();
        let releaseTypePost = null;
        if (releaseType === 'android post' || 'desktop post') {
            let releaseTypePost = releaseType.charAt(0).toUpperCase() + releaseType.slice(-5);
        }
        let releaseTypeName = releaseType.charAt(0).toUpperCase() + releaseType.slice(1);
        if (releaseType !== 'android' && releaseType !== 'desktop' && releaseType !== 'android post' && releaseType !== 'desktop post') {
            msg.reply('Please specify which release notes to display: "desktop" or "android".');
            return;
        }
        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Super Agent/0.0.1'
        };
        // Configure the request
        let options;
        if (releaseTypePost !== null) {
            options = {
                url: 'https://api.github.com/repos/lbryio/lbry-' + releaseTypePost + '/releases/latest',
                method: 'GET',
                headers: headers
            };
        } else {
            console.log('Release being sent: ' + releaseTypeName);
            options = {
                url: 'https://api.github.com/repos/lbryio/lbry-' + releaseTypeName + '/releases/latest',
                method: 'GET',
                headers: headers
            };
        }
        // Start the request
        let message;
        request(options, function(error, response, body) {
            let json = JSON.parse(body);
            let releasemessage = json.body;
            console.log(releasemessage);
            let releasename = json.name || json.tag_name;
            let releasedate = json.published_at;
            let releaseurl = json.html_url;
            if (releasemessage.length < 2000) {
                message = {
                    embed: {
                        title: '*Download ' + releasename + ' here!*',
                        description: releasemessage.replace('###', ''),
                        url: releaseurl,
                        color: 7976557,
                        timestamp: releasedate,
                        author: {
                            name: 'LBRY ' + releaseType + ' release notes for ' + releasename,
                            icon_url: 'https://spee.ch/b/Github-PNG-Image.png'
                        },
                        footer: {
                            icon_url: 'https://spee.ch/2/pinkylbryheart.png',
                            text: 'LBRY ' + releaseType + ' updated '
                        }
                    }
                };
                if (inPrivate(msg)) {
                    msg.channel.send(message);
                    return;
                }
                if (hasPerms(msg) && suffix === releaseTypeName + ' post') {
                    bot.channels.get(ChannelID).send(message);
                } else {
                    msg.channel.send(msg.author + ' Release notes sent via DM');
                    msg.author.send(message);
                }
            } else {
                message = releasemessage
                    .trim()
                    .split('###')
                    .filter(function(n) {
                        return n !== '';
                    });
                let embedmessages = [];
                for (let i = 0; i < message.length; i++) {
                    if (message[i]) {
                        embedmessages.push({
                            embed: {
                                description: message[i],
                                url: releaseurl,
                                color: 7976557,
                                timestamp: releasedate,
                                author: {
                                    name: 'LBRY ' + releaseTypeName + ' release notes for ' + releasename,
                                    icon_url: 'https://spee.ch/b/Github-PNG-Image.png'
                                },
                                footer: {
                                    icon_url: 'https://spee.ch/2/pinkylbryheart.png',
                                    text: 'LBRY ' + releaseTypeName + ' updated '
                                }
                            }
                        });
                        if (i === 0) embedmessages[i].embed.title = '*Download ' + releasename + ' here!*';
                    }
                }
                if (inPrivate(msg)) {
                    for (let i = 0; i < embedmessages.length; i++) {
                        msg.channel.send(embedmessages[i]);
                    }
                    return;
                } 
                if (hasPerms(msg) && suffix === releaseTypeName + ' post') {
                    for (let i = 0; i < embedmessages.length; i++) {
                        bot.channels.get(ChannelID).send(embedmessages[i]);
                    }
                } else {
                    msg.channel.send(msg.author + ' Release notes sent via DM');
                    for (let i = 0; i < embedmessages.length; i++) {
                        msg.author.send(embedmessages[i]);
                    }
                }
            }
        });
    }
};
