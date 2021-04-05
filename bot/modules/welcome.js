let hasPerms = require('../helpers.js').hasPerms;
let inPrivate = require('../helpers.js').inPrivate;

/* Disabled Temporarily
exports.custom = ['onUserJoin']; 
exports.onUserJoin = function(bot) {
  bot.on('guildMemberAdd', member => {
    member
      .send({
        embed: {
          title: '*Click here for more info about LBRY!*',
          description:
            '**Welcome to LBRY Discord Community, you are now officially a LBRYian!** \n' +
            'If you are new to LBRY and would like to learn more, see the links at the end of this message. \n' +
            'This community allows LBRYians to interact with the team directly and for us to engage users in order to grow the LBRY platform! \n' +
            '**Looking for *Rewards Approval*? Please make a request in the #rewards-approval channel by sending a direct message (DM) to @RewardsBot#0287. You can do this by right clicking on the name. A mod will reach out to you, please be patient . **Note: DO NOT message any team members or post in other channels about rewards approval concerns.**. Only 1 Reward account is allowed per household** \n',
          url: 'https://lbry.com/what',
          color: 7976557,
          author: {
            name: 'Welcome to LBRY Discord Community',
            icon_url: 'https://spee.ch/2/pinkylbryheart.png'
          }
        }
      })
      .catch(function(error) {
        bot.channels
          .get('369896313082478594')
          .send(
            member +
              ', Please enable Direct Messages from server members to communicate fully with our bot, it is located in the user setting area under Privacy & Safety tab, select the option allow direct messages from server members\nSince the bot could not send you our Welcome message please check the posts in <#431211007050776577> and see the Wunderbot and tipbot commands by typing `!help` in <#369896313082478594>'
          );
      });
    member
      .send({
        embed: {
          description:
            '1. Be respectful to other community members. Harassment and vulgarity will not be tolerated \n' +
            '2. Do not spam, advertise or post referral links \n' +
            '3. Use appropriate channels for your discussions/questions. If you are looking for help with LBRY, use #help, for price talk, use #market-and-trading \n' +
            '4. #general discussions should be at least somewhat related to LBRY, otherwise there is #random \n' +
            '5. Do not post **not safe for work (NFSW)** content in any non-marked channels, there is #random-nsfw for that \n' +
            '6. Do not direct message and LBRY team or mods without being asked to do so \n' +
            '7. Do not request free LBC, begging will not be tolerated \n',
          color: 7976557,
          author: {
            name: 'Ground rules',
            icon_url: 'https://spee.ch/2/pinkylbryheart.png'
          }
        }
      })
      .catch(function(error) {
        console.log('could not send dm');
      });
    member
      .send({
        embed: {
          description:
            '1. Type !tip help in the #bot-sandbox channel to interact with our Tipbot which can be used to send and receive LBRY Credits (LBC). **Enable 2FA in your Discord account settings!** \n' +
            '2. See the Frequently Asked Questions (FAQ) section below prior to asking for help or information on LBRY \n' +
            '3. Backing up your LBRY wallet is your responsibility, see FAQ link below \n' +
            '4. You can find the LBRY Block explorer at https://explorer.lbry.com \n' +
            '5. Want to contribute more? Check out https://lbry.tech/contribute \n' +
            '6. Are you a dev? Check out the #dev channel \n' +
            '7. Want to share something you published? Post it on the #publishers channel \n',
          color: 7976557,
          author: {
            name: 'Helpful hints',
            icon_url: 'https://spee.ch/2/pinkylbryheart.png'
          }
        }
      })
      .catch(function(error) {
        console.log('could not send dm');
      });
    member
      .send({
        embed: {
          title: '*Click here for more info about LBRY!*',
          description:
            '[**LBRY**](https://lbry.com) is a protocol providing fully decentralized network for the discovery, distribution, and payment of data. It utilizes the [**LBRY blockchain**](https://lbry.com/what#the-network) as a global namespace and database of digital content. Blockchain entries contain searchable content metadata, identities, and rights and access rules. \n[_**Download the LBRY App here**_](https://lbry.com/get)',
          url: 'https://lbry.com/what',
          color: 7976557,
          author: {
            name: 'What is LBRY?',
            url: 'https://lbry.com/what',
            icon_url: 'https://spee.ch/2/pinkylbryheart.png'
          }
        }
      })
      .catch(function(error) {
        console.log('could not send dm');
      });
    member
      .send({
        embed: {
          title: '*Click here to see all LBRY Frequently Asked Questions (FAQ)!*',
          description:
            'Want to backup your LBRY wallet? [**Backup**](https://lbry.com/faq/how-to-backup-wallet) \nLooking for LBRY data? [**Behind the scenes files**](https://lbry.com/faq/lbry-directories) \nTrouble starting LBRY? [**Startup troubleshooting**](https://lbry.com/faq/startup-troubleshooting) \nNeed help finding your log files (will help us troubleshoot!)? [**Find logs**](https://lbry.com/faq/how-to-find-lbry-log-file) \nNot able to stream any content? [**Troubleshoot streaming**](https://lbry.com/faq/unable-to-stream)\nNeed help with publishing? [**How to Publish**](https://lbry.com/faq/how-to-publish) \nWant more LBRY Credits (LBC)? [**Get LBC**](https://lbry.com/faq/earn-credits) \nLooking for referral information? [**Referrals**](https://lbry.com/faq/referrals)',
          url: 'https://lbry.com/faq',
          color: 7976557,
          author: {
            name: 'LBRY FAQ',
            url: 'https://lbry.com/faq',
            icon_url: 'https://spee.ch/8/Id5Qoc3w.png'
          }
        }
      })
      .catch(function(error) {
        console.log('could not send dm');
      });
    member
      .send({
        embed: {
          title: '*Have you checked out spee.ch yet?!*',
          description:
            "[**spee.ch**](https://spee.ch) runs on top of the LBRY network - it's essentially an open source, censorship resistant and decentralized image and video sharing site with the added benefit of being a web-based (works on mobile too!) gateway into the LBRY network. spee.ch can be used to retrieve LBRY images/videos that are free by accessing them through a web browser. \nFor example, if content is located at lbry://loose-cannons-episode1#12c87bb42dd8832167b1e54edf72bbd37bc47622, you can view it on spee.ch at: https://spee.ch/12c87bb42dd8832167b1e54edf72bbd37bc47622/loose-cannons-episode1. You can also view channels on spee.ch, such as: https://spee.ch/@copchronicles:5c039dc7423657e59d78939df72c186e43273675 or https://spee.ch/@MinutePhysics:589276465a23c589801d874f484cc39f307d7ec7 \n\nspee.ch also allows you to create a channel to group your uploads and retrieve them easily. These channels are separate from any you may have in the LBRY app since they exist on the spee.ch site via a login process. You can even share your channel name and password so that others can contribute to it.",
          url: 'https://spee.ch/about',
          color: 7976557,
          author: {
            name: 'spee.ch',
            url: 'https://spee.ch',
            icon_url: 'https://spee.ch/e/flag-green-blue-purple-indigo-bars-background.png'
          }
        }
      })
      .catch(function(error) {
        console.log('could not send dm');
        console.log(error);
      });
  });
};
*/
exports.commands = [
  'welcome' // command that is in this file, every command needs it own export as shown below
];

exports.welcome = {
  usage: '<@username>',
  description: 'send welcome message to specified user',
  process: function(bot, msg, suffix) {
    if (inPrivate(msg)) {
      msg.channel.send('command cannot be used in a DM');
      return;
    }
    if (suffix === '') {
      msg.channel.send('no user defined');
      return;
    }
    if (!hasPerms(msg)) {
      msg.channel.send('You Dont Have Permission To Use This Command!');
      return;
    }
    msg.mentions.members
      .first()
      .send({
        embed: {
          title: '*Click here for more info about LBRY!*',
          description:
            '**Welcome to LBRY Discord Community, you are now officially a LBRYian!** \n' +
            'If you are new to LBRY and would like to learn more, see the links at the end of this message. \n' +
            'This community allows LBRYians to interact with the team directly and for us to engage users in order to grow the LBRY platform! \n' +
            '**Looking for *Rewards Approval*? Please make a request in the #rewards-approval channel by sending a direct message (DM) to @RewardsBot#0287. You can do this by right clicking on the name. A mod will reach out to you, please be patient, **Note: DO NOT message any team members or post in other channels about rewards approval concerns.**. Only 1 Reward account is allowed per household** \n',
          url: 'https://lbry.com/what',
          color: 7976557,
          author: {
            name: 'Welcome to LBRY Discord Community',
            icon_url: 'https://spee.ch/2/pinkylbryheart.png'
          }
        }
      })
      .catch(function(error) {
        msg.channel.send(
          msg.mentions.members.first() +
            ', Please enable Direct Messages from server members to communicate fully with our bot, it is located in the user setting area under Privacy & Safety tab, select the option allow direct messages from server members'
        );
      });
    msg.mentions.members
      .first()
      .send({
        embed: {
          description:
            '1. Be respectful to other community members. Harassment and vulgarity will not be tolerated \n' +
            '2. Do not spam, advertise or post referral links \n' +
            '3. Use appropriate channels for your discussions/questions. If you are looking for help with LBRY, use #help, for price talk, use #market-and-trading \n' +
            '4. #general discussions should be at least somewhat related to LBRY, otherwise there is #random \n' +
            '5. Do not post **not safe for work (NFSW)** content in any non-marked channels, there is #random-nsfw for that \n' +
            '6. Do not direct message and LBRY team or mods without being asked to do so \n' +
            '7. Do not request free LBC, begging will not be tolerated \n',
          color: 7976557,
          author: {
            name: 'Ground rules',
            icon_url: 'https://spee.ch/2/pinkylbryheart.png'
          }
        }
      })
      .catch(function(error) {
        console.log('could not send dm');
        console.log(error);
      });
    msg.mentions.members
      .first()
      .send({
        embed: {
          description:
            '1. Type !tip help in the #bot-sandbox channel to interact with our Tipbot which can be used to send and receive LBRY Credits (LBC). **Enable 2FA in your Discord account settings!** \n' +
            '2. See the Frequently Asked Questions (FAQ) section below prior to asking for help or information on LBRY \n' +
            '3. Backing up your LBRY wallet is your responsibility, see FAQ link below \n' +
            '4. You can find the LBRY Block explorer at https://explorer.lbry.com \n' +
            '5. Want to contribute more? Check out https://lbry.com/faq/contributing \n' +
            '6. Are you a dev? Check out the #dev channel \n' +
            '7. Want to share something you published? Post it on the #publishers channel \n',
          color: 7976557,
          author: {
            name: 'Helpful hints',
            icon_url: 'https://spee.ch/2/pinkylbryheart.png'
          }
        }
      })
      .catch(function(error) {
        console.log('could not send dm');
        console.log(error);
      });
    msg.mentions.members
      .first()
      .send({
        embed: {
          title: '*Click here for more info about LBRY!*',
          description:
            '[**LBRY**](https://lbry.com) is a protocol providing fully decentralized network for the discovery, distribution, and payment of data. It utilizes the [**LBRY blockchain**](https://lbry.com/what#the-network) as a global namespace and database of digital content. Blockchain entries contain searchable content metadata, identities, and rights and access rules. \n[_**Download the LBRY App here**_](https://lbry.com/get)',
          url: 'https://lbry.com/what',
          color: 7976557,
          author: {
            name: 'What is LBRY?',
            url: 'https://lbry.com/what',
            icon_url: 'https://spee.ch/2/pinkylbryheart.png'
          }
        }
      })
      .catch(function(error) {
        console.log('could not send dm');
        console.log(error);
      });
    msg.mentions.members
      .first()
      .send({
        embed: {
          title: '*Click here to see all LBRY Frequently Asked Questions (FAQ)!*',
          description:
            'Want to backup your LBRY wallet? [**Backup**](https://lbry.com/faq/how-to-backup-wallet) \nLooking for LBRY data? [**Behind the scenes files**](https://lbry.com/faq/lbry-directories) \nTrouble starting LBRY? [**Startup troubleshooting**](https://lbry.com/faq/startup-troubleshooting) \nNeed help finding your log files (will help us troubleshoot!)? [**Find logs**](https://lbry.com/faq/how-to-find-lbry-log-file) \nNot able to stream any content? [**Troubleshoot streaming**](https://lbry.com/faq/unable-to-stream)\nNeed help with publishing? [**How to Publish**](https://lbry.com/faq/how-to-publish) \nWant more LBRY Credits (LBC)? [**Get LBC**](https://lbry.com/faq/earn-credits) \nLooking for referral information? [**Referrals**](https://lbry.com/faq/referrals)',
          url: 'https://lbry.com/faq',
          color: 7976557,
          author: {
            name: 'LBRY FAQ',
            url: 'https://lbry.com/faq',
            icon_url: 'https://spee.ch/8/Id5Qoc3w.png'
          }
        }
      })
      .catch(console.error)
        console.log('could not send dm');
        console.log(error);
    msg.mentions.members
      .first()
      .send({
        embed: {
          title: '*Have you checked out spee.ch yet?!*',
          description:
            "[**spee.ch**](https://spee.ch) runs on top of the LBRY network - it's essentially an open source, censorship resistant and decentralized image and video sharing site with the added benefit of being a web-based (works on mobile too!) gateway into the LBRY network. spee.ch can be used to retrieve LBRY images/videos that are free by accessing them through a web browser. \nFor example, if content is located at lbry://loose-cannons-episode1#12c87bb42dd8832167b1e54edf72bbd37bc47622, you can view it on spee.ch at: https://spee.ch/12c87bb42dd8832167b1e54edf72bbd37bc47622/loose-cannons-episode1. You can also view channels on spee.ch, such as: https://spee.ch/@copchronicles:5c039dc7423657e59d78939df72c186e43273675 or https://spee.ch/@MinutePhysics:589276465a23c589801d874f484cc39f307d7ec7 \n\nspee.ch also allows you to create a channel to group your uploads and retrieve them easily. These channels are separate from any you may have in the LBRY app since they exist on the spee.ch site via a login process. You can even share your channel name and password so that others can contribute to it.",
          url: 'https://spee.ch/about',
          color: 7976557,
          author: {
            name: 'spee.ch',
            url: 'https://spee.ch',
            icon_url: 'https://spee.ch/e/flag-green-blue-purple-indigo-bars-background.png'
          }
        }
      })
      .catch(function(error) {
        console.log('could not send dm');
        console.log(error);
      });
  }
};
