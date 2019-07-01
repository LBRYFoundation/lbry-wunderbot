let inPrivate = require('../helpers.js').inPrivate;
let { RichEmbed } = require('discord.js');
exports.custom = [
  'lbrylink' //change this to your function name
];

exports.lbrylink = async function(bot, msg, suffix) {
  bot.on('message', msg => {
    if (inPrivate(msg)) {
      return;
    }

    const urlOccurrences = (msg.content.match(/lbry:\/\//g) || []).length;
    if (urlOccurrences > 0) {
      //convert all mentions to a plain string (because lbry://@Nikooo777 gets parsed as lbry://@<123123123> instead)
      let mentions = msg.mentions.users;
      mentions.forEach(m => {
        msg.content = msg.content.replace(new RegExp(m.toString(), 'g'), `@${m.username}`);
      });

      //compile a list of URLs
      let urls = msg.content.match(/lbry:\/\/\S+/g);

      //clean URLS from any prepended or appended extra chars
      for (let i = 0; i < urls.length; i++) {
        urls[i] = urls[i].replace(/^lbry:\/\//g, 'https://open.lbry.com/').replace(/\W+$/g, '');
      }
      const linkEmbed = new RichEmbed();
      linkEmbed
        .setAuthor('LBRY Linker')
        .setDescription("I see you tried to post a LBRY URL, here's a friendly hyperlink to share and for others to access your content with a single click:")
        .setColor(7976557);
      urls.forEach(url => linkEmbed.addField('Open with LBRY:', url, true));
      return msg.channel.send({ embed: linkEmbed });
    }
  });
};
