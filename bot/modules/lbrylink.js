let inPrivate = require('../helpers.js').inPrivate;
let responseDebug = false;
exports.custom = [
  'lbrylink' //change this to your function name
];

exports.lbrylink = function(bot, msg, suffix) {
  bot.on('message', msg => {
    if (inPrivate(msg)) {
      return;
    }
    if (msg.content.includes('lbry://')) {
      //Extract URL from Message
      newURL = msg.content
        .replace('lbry://', 'https://open.lbry.io/')
        .match(/\bhttps?:\/\/\S+/gi)
        .toString();
      if (responseDebug) {
        console.log('___________________________');
        console.log('newURL = ' + newURL);
      }

      //Check if just lbry:// was supplied
      if (newURL == 'https://open.lbry.io/') {
        return;
      }

      //Check if Username Was Supplied
      if (newURL.includes('>')) {
        //Get rid of ID from message
        parseID = newURL.split('>').pop();
        newURL = 'https://open.lbry.io' + parseID;
        if (responseDebug) {
          console.log('Username Provided!');
          console.log('parseID = ' + parseID);
          console.log('newURL = ' + newURL);
        }

        //check if just Username Was Supplied
        if (!newURL.substr(20).includes('/')) {
          return;
        }

        //check if more than username was supplied
        //Also check obscurity in username like ``@MSFTserver` vs `@MSFTserverPics`
        if (parseID.includes('/')) {
          //parse out extra params before `/` like `<@123456789>Pics`
          parseID = parseID.split('/').pop();
          newURL = 'https://open.lbry.io/' + parseID;
          if (responseDebug) {
            console.log('Username no / check');
            console.log('parseID = ' + parseID);
            console.log('newURL = ' + newURL);
          }

          //checks if username had if after it or just blank to be safe
          if (newURL == 'https://open.lbry.io/' || parseID.startsWith('#')) {
            return;
          }
        }

        //one last saftey check
        if (newURL == 'https://open.lbry.io') {
          return;
        }

        //If no UserName Found proceed
      } else {
        if (newURL == 'https://open.lbry.io/') {
          return;
        }
        if (responseDebug) {
          console.log('___________________________');
          console.log('newURL = ' + newURL);
        }
      }
      const embed = {
        description: "I see you tried to post a LBRY URL, here's a friendly hyperlink to share and for others to access your content with a single click: \n" + newURL,
        color: 7976557,
        author: {
          name: 'LBRY Linker',
          icon_url: 'https://i.imgur.com/yWf5USu.png'
        }
      };
      msg.channel.send({ embed });
    }
  });
};
