let hasPerms = require("../helpers.js").hasPerms;
let inPrivate = require("../helpers.js").inPrivate;

exports.custom = ["onUserJoin"];
exports.onUserJoin = function(bot) {
  bot.on("guildMemberAdd", member => {
    member.send({
      embed: {
        title: "*Click here for more info about LBRY!*",
        description:
          "**Welcome to LBRY Discord Community, you are now officially a LBRYian!** \n" +
          "If you are new to LBRY and would like to learn more, see the links at the end of this message. \n" +
          "This community allows LBRYians to interact with the team directly and for us to engage users in order to grow the LBRY platform! \n" +
          "**Looking for *Rewards Verification*? Please make a request in the #verification channel and type **-new** this will create a ticket (channel) for your request. A mod will reach out to you, please be patient . **Note: DO NOT message any team members or post in other channels about verification concerns.**. Only 1 Reward account is allowed per person** \n",
        url: "https://lbry.io/what",
        color: 7976557,
        author: {
          name: "Welcome to LBRY Discord Community",
          icon_url: "https://i.imgur.com/yWf5USu.png"
        }
      }
    });
    member.send({
      embed: {
        description:
          "1. Be respectful to other community members. Harrasment and vulgarity will not be tolerated \n" +
          "2. Do not spam, advertise or post referral links \n" +
          "3. Use appropriate channels for your discussions/questions. If you are looking for help with LBRY, use #help, for price talk, use #market-and-trading \n" +
          "4. #general discussions should be at least somewhat related to LBRY, otherwise there is #random \n" +
          "5. Do not post **not safe for work (NFSW)** content in any non-marked channels, there is #random-nsfw for that \n" +
          "6. Do not direct message and LBRY team or mods without being asked to do so \n" +
          "7. Do not request free LBC, begging will not be tolerated \n",
        color: 7976557,
        author: {
          name: "Ground rules",
          icon_url: "https://i.imgur.com/yWf5USu.png"
        }
      }
    });
    member.send({
      embed: {
        description:
          "1. Type !tip help in the #bot-sandbox channel to interact with our Tipbot which can be used to send and receive LBRY Credits (LBC). **Enable 2FA in your Discord account settings!** \n" +
          "2. See the Frequently Asked Questions (FAQ) section below prior to asking for help or information on LBRY \n" +
          "3. Backing up your LBRY wallet is your responsbility, see FAQ link below \n" +
          "4. You can find the LBRY Block explorer at https://explorer.lbry.io \n" +
          "5. Want to contribute more? Check out https://lbry.io/faq/contributing \n" +
          "6. Are you a dev? Check out the #dev channel \n" +
          "7. Want to share something you published? Post it on the #publishers channel \n",
        color: 7976557,
        author: {
          name: "Helpful hints",
          icon_url: "https://i.imgur.com/yWf5USu.png"
        }
      }
    });
    member.send({
      embed: {
        title: "*Click here for more info about LBRY!*",
        description:
          "[**LBRY**](https://lbry.io) is a protocol providing fully decentralized network for the discovery, distribution, and payment of data. It utilizes the [**LBRY blockchain**](https://lbry.io/what#the-network) as a global namespace and database of digital content. Blockchain entries contain searchable content metadata, identities, and rights and access rules. \n[_**Download the LBRY App here**_](https://lbry.io/get)",
        url: "https://lbry.io/what",
        color: 7976557,
        author: {
          name: "What is LBRY?",
          url: "https://lbry.io/what",
          icon_url: "https://i.imgur.com/yWf5USu.png"
        }
      }
    });
    member.send({
      embed: {
        title: "*Click here to see all LBRY Frequently Asked Questions (FAQ)!*",
        description:
          "Want to backup your LBRY wallet? [**Backup**](https://lbry.io/faq/how-to-backup-wallet) \nLooking for LBRY data? [**Behind the scenes files**](https://lbry.io/faq/lbry-directories) \nTrouble starting LBRY? [**Startup troubleshooting**](https://lbry.io/faq/startup-troubleshooting) \nNeed help finding your log files (will help us troubleshoot!)? [**Find logs**](https://lbry.io/faq/how-to-find-lbry-log-file) \nNot able to stream any content? [**Troublshoot streaming**](https://lbry.io/faq/unable-to-stream)\nNeed help with publishing? [**How to Publish**](https://lbry.io/faq/how-to-publish) \nWant more LBRY Credits (LBC)? [**Get LBC**](https://lbry.io/faq/earn-credits) \nLooking for referral information? [**Referrals**](https://lbry.io/faq/referrals)",
        url: "https://lbry.io/faq",
        color: 7976557,
        author: {
          name: "LBRY FAQ",
          url: "https://lbry.io/faq",
          icon_url: "https://spee.ch/8/Id5Qoc3w.png"
        }
      }
    });
    member.send({
      embed: {
        title: "*Have you checked out spee.ch yet?!*",
        description:
          "[**spee.ch**](https://spee.ch) runs on top of the LBRY network - it's essentially an open source, censorship resistent and decentralized image and video sharing site with the added benefit of being a web-based (works on mobile too!) gateway into the LBRY network. spee.ch can be used to retrieve LBRY images/videos that are free by accessing them through a web browser. \nFor example, if content is located at lbry://loose-cannons-episode1#12c87bb42dd8832167b1e54edf72bbd37bc47622, you can view it on spee.ch at: https://spee.ch/12c87bb42dd8832167b1e54edf72bbd37bc47622/loose-cannons-episode1. You can also view channels on spee.ch, such as: https://spee.ch/@copchronicles:5c039dc7423657e59d78939df72c186e43273675 or https://spee.ch/@MinutePhysics:589276465a23c589801d874f484cc39f307d7ec7 \n\nspee.ch also allows you to create a channel to group your uploads and retreive them easily. These channels are separate from any you may have in the LBRY app since they exist on the spee.ch site via a login process. You can even share your channel name and password so that others can contribute to it.",
        url: "https://spee.ch/about",
        color: 7976557,
        author: {
          name: "spee.ch",
          url: "https://spee.ch",
          icon_url:
            "http://www.pd4pic.com/images/flag-green-blue-purple-indigo-bars-background.png"
        }
      }
    });
  });
};

exports.commands = [
  "welcome" // command that is in this file, every command needs it own export as shown below
];

exports.welcome = {
  usage: "<@username>",
  description: "send welcome message to specified user",
  process: function(bot, msg, suffix) {
    if (inPrivate(msg)) {
      msg.channel.send("command cannot be used in a DM");
      return;
    }
    if (suffix == "") {
      msg.channel.send("no user defined");
      return;
    }
    if (!hasPerms(msg)) {
      msg.channel.send("You Dont Have Permission To Use This Command!");
      return;
    }
    msg.mentions.members.first().send({
      embed: {
        title: "*Click here for more info about LBRY!*",
        description:
          "**Welcome to LBRY Discord Community, you are now officially a LBRYian!** \n" +
          "If you are new to LBRY and would like to learn more, see the links at the end of this message. \n" +
          "This community allows LBRYians to interact with the team directly and for us to engage users in order to grow the LBRY platform! \n" +
          "**Looking for *Rewards Verification*? Please make a request in the #verification channel and type **-new** this will create a ticket (channel) for your request. A mod will reach out to you, please be patient, **Note: DO NOT message any team members or post in other channels about verification concerns.**. Only 1 Reward account is allowed per person** \n",
        url: "https://lbry.io/what",
        color: 7976557,
        author: {
          name: "Welcome to LBRY Discord Community",
          icon_url: "https://i.imgur.com/yWf5USu.png"
        }
      }
    });
    msg.mentions.members.first().send({
      embed: {
        description:
          "1. Be respectful to other community members. Harrasment and vulgarity will not be tolerated \n" +
          "2. Do not spam, advertise or post referral links \n" +
          "3. Use appropriate channels for your discussions/questions. If you are looking for help with LBRY, use #help, for price talk, use #market-and-trading \n" +
          "4. #general discussions should be at least somewhat related to LBRY, otherwise there is #random \n" +
          "5. Do not post **not safe for work (NFSW)** content in any non-marked channels, there is #random-nsfw for that \n" +
          "6. Do not direct message and LBRY team or mods without being asked to do so \n" +
          "7. Do not request free LBC, begging will not be tolerated \n",
        color: 7976557,
        author: {
          name: "Ground rules",
          icon_url: "https://i.imgur.com/yWf5USu.png"
        }
      }
    });
    msg.mentions.members.first().send({
      embed: {
        description:
          "1. Type !tip help in the #bot-sandbox channel to interact with our Tipbot which can be used to send and receive LBRY Credits (LBC). **Enable 2FA in your Discord account settings!** \n" +
          "2. See the Frequently Asked Questions (FAQ) section below prior to asking for help or information on LBRY \n" +
          "3. Backing up your LBRY wallet is your responsbility, see FAQ link below \n" +
          "4. You can find the LBRY Block explorer at https://explorer.lbry.io \n" +
          "5. Want to contribute more? Check out https://lbry.io/faq/contributing \n" +
          "6. Are you a dev? Check out the #dev channel \n" +
          "7. Want to share something you published? Post it on the #publishers channel \n",
        color: 7976557,
        author: {
          name: "Helpful hints",
          icon_url: "https://i.imgur.com/yWf5USu.png"
        }
      }
    });
    msg.mentions.members.first().send({
      embed: {
        title: "*Click here for more info about LBRY!*",
        description:
          "[**LBRY**](https://lbry.io) is a protocol providing fully decentralized network for the discovery, distribution, and payment of data. It utilizes the [**LBRY blockchain**](https://lbry.io/what#the-network) as a global namespace and database of digital content. Blockchain entries contain searchable content metadata, identities, and rights and access rules. \n[_**Download the LBRY App here**_](https://lbry.io/get)",
        url: "https://lbry.io/what",
        color: 7976557,
        author: {
          name: "What is LBRY?",
          url: "https://lbry.io/what",
          icon_url: "https://i.imgur.com/yWf5USu.png"
        }
      }
    });
    msg.mentions.members.first().send({
      embed: {
        title: "*Click here to see all LBRY Frequently Asked Questions (FAQ)!*",
        description:
          "Want to backup your LBRY wallet? [**Backup**](https://lbry.io/faq/how-to-backup-wallet) \nLooking for LBRY data? [**Behind the scenes files**](https://lbry.io/faq/lbry-directories) \nTrouble starting LBRY? [**Startup troubleshooting**](https://lbry.io/faq/startup-troubleshooting) \nNeed help finding your log files (will help us troubleshoot!)? [**Find logs**](https://lbry.io/faq/how-to-find-lbry-log-file) \nNot able to stream any content? [**Troublshoot streaming**](https://lbry.io/faq/unable-to-stream)\nNeed help with publishing? [**How to Publish**](https://lbry.io/faq/how-to-publish) \nWant more LBRY Credits (LBC)? [**Get LBC**](https://lbry.io/faq/earn-credits) \nLooking for referral information? [**Referrals**](https://lbry.io/faq/referrals)",
        url: "https://lbry.io/faq",
        color: 7976557,
        author: {
          name: "LBRY FAQ",
          url: "https://lbry.io/faq",
          icon_url: "https://spee.ch/8/Id5Qoc3w.png"
        }
      }
    });
    msg.mentions.members.first().send({
      embed: {
        title: "*Have you checked out spee.ch yet?!*",
        description:
          "[**spee.ch**](https://spee.ch) runs on top of the LBRY network - it's essentially an open source, censorship resistent and decentralized image and video sharing site with the added benefit of being a web-based (works on mobile too!) gateway into the LBRY network. spee.ch can be used to retrieve LBRY images/videos that are free by accessing them through a web browser. \nFor example, if content is located at lbry://loose-cannons-episode1#12c87bb42dd8832167b1e54edf72bbd37bc47622, you can view it on spee.ch at: https://spee.ch/12c87bb42dd8832167b1e54edf72bbd37bc47622/loose-cannons-episode1. You can also view channels on spee.ch, such as: https://spee.ch/@copchronicles:5c039dc7423657e59d78939df72c186e43273675 or https://spee.ch/@MinutePhysics:589276465a23c589801d874f484cc39f307d7ec7 \n\nspee.ch also allows you to create a channel to group your uploads and retreive them easily. These channels are separate from any you may have in the LBRY app since they exist on the spee.ch site via a login process. You can even share your channel name and password so that others can contribute to it.",
        url: "https://spee.ch/about",
        color: 7976557,
        author: {
          name: "spee.ch",
          url: "https://spee.ch",
          icon_url:
            "http://www.pd4pic.com/images/flag-green-blue-purple-indigo-bars-background.png"
        }
      }
    });
  }
};
