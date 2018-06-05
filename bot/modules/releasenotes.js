let request = require('request');
let config = require('config');
let hasPerms = require('../helpers.js').hasPerms;
let inPrivate = require('../helpers.js').inPrivate;
let ChannelID = config.get('gitrelease').channel;

exports.commands = [
  'releasenotes' // command that is in this file, every command needs it own export as shown below
];

exports.releasenotes = {
  usage: '',
  description: 'gets current release notes from GITHUB',
  process: function(bot, msg, suffix) {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Super Agent/0.0.1'
    };
    // Configure the request
    const options = {
      url: 'https://api.github.com/repos/lbryio/lbry-app/releases/latest',
      method: 'GET',
      headers: headers
    };

    // Start the request
    let message;
    request(options, function(error, response, body) {
      let releasemessage = JSON.parse(body).body;
      let releasename = JSON.parse(body).name;
      let releasedate = JSON.parse(body).published_at;
      let releaseurl = JSON.parse(body).html_url;
      if (releasemessage.length < 2000) {
        message = {
          embed: {
            title: '*Download ' + releasename + ' here!*',
            description: releasemessage,
            url: releaseurl,
            color: 7976557,
            timestamp: releasedate,
            author: {
              name: 'Lbry-app Release Notes for ' + releasename,
              icon_url: 'http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png'
            },
            footer: {
              icon_url: 'https://i.imgur.com/yWf5USu.png',
              text: 'Lbry-app Updated '
            }
          }
        };
        if (inPrivate(msg)) {
          msg.channel.send(message);
          return;
        }
        if (hasPerms(msg) && suffix === 'post') {
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
        let releasemessage1 = message[0];
        let releasemessage2 = message[1];
        let releasemessage3 = message[2];
        let releasemessage4 = message[3];
        let releasemessage5 = message[4];
        let message1 = {
          embed: {
            title: '*Download ' + releasename + ' here!*',
            description: releasemessage1,
            url: releaseurl,
            color: 7976557,
            timestamp: releasedate,
            author: {
              name: 'Lbry-app Release Notes for ' + releasename,
              icon_url: 'http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png'
            },
            footer: {
              icon_url: 'https://i.imgur.com/yWf5USu.png',
              text: 'Lbry-app Updated '
            }
          }
        };
        let message2 = {
          embed: {
            description: releasemessage2,
            color: 7976557,
            timestamp: releasedate,
            author: {
              icon_url: 'http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png'
            },
            footer: {
              icon_url: 'https://i.imgur.com/yWf5USu.png',
              text: 'Lbry-app Updated '
            }
          }
        };
        let message3 = {
          embed: {
            description: releasemessage3,
            color: 7976557,
            timestamp: releasedate,
            author: {
              icon_url: 'http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png'
            },
            footer: {
              icon_url: 'https://i.imgur.com/yWf5USu.png',
              text: 'Lbry-app Updated '
            }
          }
        };
        let message4 = {
          embed: {
            description: releasemessage4,
            color: 7976557,
            timestamp: releasedate,
            author: {
              icon_url: 'http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png'
            },
            footer: {
              icon_url: 'https://i.imgur.com/yWf5USu.png',
              text: 'Lbry-app Updated '
            }
          }
        };
        let message5 = {
          embed: {
            description: releasemessage5,
            color: 7976557,
            timestamp: releasedate,
            author: {
              icon_url: 'http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png'
            },
            footer: {
              icon_url: 'https://i.imgur.com/yWf5USu.png',
              text: 'Lbry-app Updated '
            }
          }
        };
        if (inPrivate(msg)) {
          msg.channel.send(message1);
          msg.channel.send(message2);
          msg.channel.send(message3);
          msg.channel.send(message4);
          msg.channel.send(message5);
          return;
        }
        if (hasPerms(msg) && suffix === 'post') {
          bot.channels.get(ChannelID).send(message1);
          bot.channels.get(ChannelID).send(message2);
          bot.channels.get(ChannelID).send(message3);
          bot.channels.get(ChannelID).send(message4);
          bot.channels.get(ChannelID).send(message5);
        } else {
          msg.channel.send(msg.author + ' Release notes sent via DM');
          msg.author.send(message1);
          msg.author.send(message2);
          msg.author.send(message3);
          msg.author.send(message4);
          msg.author.send(message5);
        }
      }
    });
  }
};
