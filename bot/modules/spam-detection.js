const authors = [];
let warned = [];
let banned = [];
let messagelog = [];
let config = require('config');
let botlog = config.get('moderation').logchannel;
let hasPerms = require('../helpers.js').hasPerms;
let inPrivate = require('../helpers.js').inPrivate;
let hasExcludedSpamChannels = require('../helpers.js').hasExcludedSpamChannels;
let hasExcludedSpamUsers = require('../helpers.js').hasExcludedSpamUsers;

/**
 * Add simple spam protection to your discord server.
 * @param  {Bot} bot - The discord.js CLient/bot
 * @param  {object} options - Optional (Custom configuarion options)
 * @return {[type]}         [description]
 */

exports.custom = ['antiSpam'];

exports.antiSpam = function(bot) {
  const warnBuffer = 5;
  const maxBuffer = 10;
  const interval = 1500;
  const warningMessage = ', Stop spamming or you will be banned! This is your warning!';
  const banMessage = 'has been banned for spamming!';
  const maxDuplicatesWarning = 5;
  const maxDuplicatesBan = 10;

  bot.on('message', msg => {
    if (inPrivate(msg) || msg.author.bot || hasPerms(msg) || hasExcludedSpamChannels(msg) || hasExcludedSpamUsers(msg)) {
      return;
    }
    if (msg.author.id != bot.user.id) {
      let now = Math.floor(Date.now());
      authors.push({
        time: now,
        author: msg.author.id
      });
      messagelog.push({
        message: msg.content,
        author: msg.author.id
      });

      // Check how many times the same message has been sent.
      let msgMatch = 0;
      for (let i = 0; i < messagelog.length; i++) {
        if (messagelog[i].message == msg.content && messagelog[i].author == msg.author.id && msg.author.id !== bot.user.id) {
          msgMatch++;
        }
      }
      // Check matched count
      if (msgMatch == maxDuplicatesWarning && !warned.includes(msg.author.id)) {
        warn(msg, msg.author.id);
      }
      if (msgMatch == maxDuplicatesBan && !banned.includes(msg.author.id)) {
        ban(msg, msg.author.id);
      }

      let matched = 0;

      for (let i = 0; i < authors.length; i++) {
        if (authors[i].time > now - interval) {
          matched++;
          if (matched == warnBuffer && !warned.includes(msg.author.id)) {
            warn(msg, msg.author.id);
          } else if (matched == maxBuffer) {
            if (!banned.includes(msg.author.id)) {
              ban(msg, msg.author.id);
            }
          }
        } else if (authors[i].time < now - interval) {
          authors.splice(i);
          warned.splice(warned.indexOf(authors[i]));
          banned.splice(warned.indexOf(authors[i]));
        }
        if (messagelog.length >= 200) {
          messagelog.shift();
        }
      }
    }
  });

  /**
   * Warn a user
   * @param  {Object} msg
   * @param  {string} userid userid
   */
  function warn(msg, userid) {
    warned.push(msg.author.id);
    msg.channel.send(msg.author + ' ' + warningMessage);
  }

  /**
   * Ban a user by the user id
   * @param  {Object} msg
   * @param  {string} userid userid
   * @return {boolean} True or False
   */
  function ban(msg, userid) {
    for (let i = 0; i < messagelog.length; i++) {
      if (messagelog[i].author == msg.author.id) {
        messagelog.splice(i);
      }
    }

    banned.push(msg.author.id);

    let user = msg.channel.guild.members.find(member => member.user.id === msg.author.id);
    if (user) {
      user
        .ban()
        .then(member => {
          msg.channel.send(msg.author + ' ' + banMessage);
          bot.channels.get(botlog).send(msg.author + ' ' + banMessage);
          return true;
        })
        .catch(() => {
          msg.channel.send('insufficient permission to kick ' + msg.author + ' for spamming.');
          return false;
        });
    }
  }
};
