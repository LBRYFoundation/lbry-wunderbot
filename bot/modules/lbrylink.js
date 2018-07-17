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
    if (msg.content.includes('lbry://')) {
      try {
        // Extract the URL(s).
        const urls = msg.content
          .replace(new RegExp("(lbry:\\/\\/)", "g"), "https://open.lbry.io/")
          .match(/\bhttps?:\/\/\S+/gi)
          .filter(url => url !== "https://open.lbry.io/");
        const cleanURLs = [];
        for (const i in urls) {
          // Check if Username Was Supplied
          const user = urls[i].match("<@.*>");
          if (user) {
            const { username } = msg.mentions.users.get(user[0].slice(2, -1));
            urls[i] = urls[i].replace(user[0], `@${username}`);
          }
          // Push clean URLs to the array.
          cleanURLs.push(urls[i]);
        }
        if (cleanURLs.length < 1) return;
        const linkEmbed = new RichEmbed();
        linkEmbed
          .setAuthor("LBRY Linker")
          .setDescription("I see you tried to post a LBRY URL, here's a friendly hyperlink to share and for others to access your content with a single click:")
          .setColor(7976557);
        cleanURLs.forEach(url => linkEmbed.addField("Open with LBRY:", url, true));
        return msg.embed(linkEmbed);
      } catch (e) {
        console.log(e);
        msg.channel.send("Something went wrong when trying to run the lbrylinker, contact a moderator.");
      }
    }
  });
};
