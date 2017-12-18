"use strict";
let config = require("config");
let miningChannel = config.get("Channels").mining;
let randomChannel = config.get("Channels").random;
let verificationChannel = config.get("Channels").verification;

exports.commands = [
  "helpcommands",
  "what",
  "begging",
  "beta",
  "github",
  "appdownload",
  "daemondownload",
  "directories",
  "faq",
  "name",
  "mining",
  "pricestance",
  "youtuber",
  "publish",
  "random",
  "referrals",
  "rewards",
  "rewardsvsreferrals",
  "cc",
  "verify",
  "verification",
  "logfile",
  "backup",
  "startup",
  "streamingissues",
  "ports",
  "migrate",
  "tipping",
  "email",
  "cli",
  "ipfstorrent"
  "shapeshift"
  "youtube"
  "transactions"
  "tipbot"
];

exports.helpcommands = {
  usage: " ",
  description:
    "Displays Helpful Commands:\n!what, !beta, !begging, !github, !appdownload, !daemondownload, !directories, !faq, !name, !mining, !pricestance, !youtuber, !publish, !random, !referrals, !rewards, !rewardsvsreferrals, !cc, !verify, !verification, !logfile, !backup, !startup, !streamingissues, !ports, !migrate, !tipping, !email, !cli, !ipfstorrent, !shapeshift, !youtube, !transactions, !tipbot,",
  process: function(bot, msg) {
    msg.channel.send({
      embed: {
        description:
          "**!what, !beta, !begging, !github, !appdownload, !daemondownload, !directories, !faq, !name, !mining, !pricestance, !youtuber, !publish, !random, !referrals, !rewards, !rewardsvsreferrals, !cc, !verify, !verification, !logfile, !backup, !startup, !streamingissues, !ports, !migrate, !tipping, !email, !cli, !ipfstorrent, !shapeshift, !youtube, !transactions, !tipbot,**",
        color: 7976557,
        author: {
          name: "List of Helpful LBRY Commands",
          icon_url: "https://i.imgur.com/yWf5USu.png"
        }
      }
    });
  }
};

exports.what = {
  usage: " ",
  description: "What is Lbry?",
  process: function(bot, msg) {
    const embed = {
      title: "*Click Here for more Info!*",
      description:
        "[**LBRY**](https://lbry.io) is a protocol providing fully decentralized network for the discovery, distribution, and payment of data. It utilizes the [**LBRY blockchain**](https://lbry.io/what#the-network) as a global namespace and database of digital content. Blockchain entries contain searchable content metadata, identities, and rights and access rules. \n[_**Get the App here**_](https://lbry.io/get)",
      url: "https://lbry.io/what",
      color: 7976557,
      author: {
        name: "What is LBRY?",
        url: "https://lbry.io/what",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.appdownload = {
  usage: " ",
  description: "LBRY-app Installers",
  process: function(bot, msg) {
    const embed = {
      description:
        "**Installers for the LBRY Application are available for download** [**HERE**](https://lbry.io/get)",
      color: 7976557,
      author: {
        name: "Get The App",
        url: "https://lbry.io/get",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.begging = {
  usage: " ",
  description: "Dont Request Free Coins Message",
  process: function(bot, msg) {
    const embed = {
      description:
        "**Please don't request free coins or invites, we have a strict policy against begging. Further offenses will result in removal from the chat.**",
      color: 7976557,
      author: {
        name: "BEGGING!",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.beta = {
  usage: " ",
  description: "beta message",
  process: function(bot, msg) {
    const embed = {
      description:
        "Even though LBRY is in Open Beta, it's still beta software! There will be bugs and issues to be worked out, thanks for your patience!",
      color: 7976557,
      author: {
        name: "Open Beta",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.github = {
  usage: " ",
  description: "Lbry Github",
  process: function(bot, msg) {
    const embed = {
      description:
        "The official github for LBRY is [github.com/lbryio](https://github.com/lbryio)",
      color: 7976557,
      author: {
        name: "GitHub",
        url: "https://github.com/lbryio",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.daemondownload = {
  usage: " ",
  description: "LBRY Daemon Installers",
  process: function(bot, msg) {
    const embed = {
      description:
        "Installers for the LBRY Daemon are available for download [**HERE**](https://github.com/lbryio/lbry/releases) ",
      color: 7976557,
      author: {
        name: "Daemon Download",
        url: "https://github.com/lbryio/lbry/releases",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.directories = {
  usage: " ",
  description: "Lbry-app Directories",
  process: function(bot, msg) {
    const embed = {
      description:
        "You can find details about the folders your LBRY files are stored in at [lbry.io/faq/lbry-directories](https://lbry.io/faq/lbry-directories)",
      color: 7976557,
      author: {
        name: "Directories",
        url: "https://lbry.io/faq/lbry-directories",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.faq = {
  usage: " ",
  description: "LBRY F.A.Q.",
  process: function(bot, msg) {
    const embed = {
      description:
        "These questions and many more have been answered on the [F.A.Q Page](https://lbry.io/faq/)",
      color: 7976557,
      author: {
        name: "F.A.Q",
        url: "https://lbry.io/faq/",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.name = {
  usage: " ",
  description: "Change Name Message",
  process: function(bot, msg) {
    const embed = {
      description:
        "Hey, glad to see you love LBRY so much, but for the safety of our users we ask that you avoid using discord names that include the word lbry. This is to prevent impersonation and scams.",
      color: 7976557,
      author: {
        name: "Discord Username",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.mining = {
  usage: " ",
  description: "Mining LBRY Credits (LBC)",
  process: function(bot, msg) {
    var message =
      "We have a dedicated channel for mining discussion, feel free to join <#" +
      miningChannel +
      ">";
    msg.channel.send(message);
  }
};

exports.pricestance = {
  usage: " ",
  description: "Our Stance on LBC Price",
  process: function(bot, msg) {
    const embed = {
      description:
        "Details about our stance on price can be found here: [lbry.io/news/acryptypical](https://lbry.io/news/acryptypical)",
      color: 7976557,
      author: {
        name: "CEO's Stance on Price",
        url: "https://lbry.io/news/acryptypical",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.youtuber = {
  usage: " ",
  description: "Are you a Youtuber curious about LBRY?",
  process: function(bot, msg) {
    const embed = {
      description:
        "Are you a Youtuber curious about LBRY? Have a look at [lbry.io/youtube](https://lbry.io/youtube)",
      color: 7976557,
      author: {
        name: "Are you a Youtuber?",
        url: "https://lbry.io/youtube",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.publish = {
  usage: " ",
  description: "How To Publish on LBRY?",
  process: function(bot, msg) {
    const embed = {
      description:
        "We've created a small guide to help with the Publishing features of LBRY, check it out here: [lbry.io/faq/how-to-publish](https://lbry.io/faq/how-to-publish)",
      color: 7976557,
      author: {
        name: "How to Publish",
        url: "https://lbry.io/faq/how-to-publish",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.random = {
  usage: " ",
  description: "Off-Topic Message",
  process: function(bot, msg) {
    var message =
      "Please keep conversation on topic, or move random conversations to #" +
      randomChannel +
      " if you wish to continue";
    msg.channel.send(message);
  }
};

exports.referrals = {
  usage: " ",
  description: "What are Referrals?",
  process: function(bot, msg) {
    const embed = {
      description:
        "Please see [lbry.io/faq/referrals](https://lbry.io/faq/referrals)  - referral redemptions are currently in test mode and limited to one. But you can see your entire referral history in your LBRY app.",
      color: 7976557,
      author: {
        name: "Referals",
        url: "https://lbry.io/faq/referrals",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.rewards = {
  usage: " ",
  description: "What are Rewards?",
  process: function(bot, msg) {
    const embed = {
      description:
        "[Rewards](https://lbry.io/faq/rewards) are given to legitimate users who are using the system (and in turn are testing things for us). In order to redeem rewards, you may need to verify your identity through a Credit Card or other manual methods.\n Please see [lbry.io/faq/identity-requirements](https://lbry.io/faq/identity-requirements)",
      color: 7976557,
      author: {
        name: "Rewards",
        url: "https://lbry.io/faq/rewards",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.rewardsvsreferrals = {
  usage: " ",
  description: "What the Difference Between Rewards & Referrals?",
  process: function(bot, msg) {
    const embed = {
      description:
        "Rewards are different to referral bonuses. Rewards are given for testing the LBRY software and system. Referrals are given for sharing LBRY with the masses.",
      color: 7976557,
      author: {
        name: "Rewards Vs. Referrals",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.cc = {
  usage: " ",
  description: "Credit Card Verification?",
  process: function(bot, msg) {
    var message =
      "In an effort to limit abuse, newly invited LBRY users will be required to verify their identity via a Credit Card or by a manual verification process in order to be eligible for Rewards. Prepaid or Virtual credit cards are disallowed. Certain countries (where we've previously seen abuse) are being denied, but that list may expand later on.  If you use Tor/Proxy/VPN, you also may be denied. If credit card verification does not work for you, please go to the <#" +
      verificationChannel +
      "> channel for assistance.\n**Verification is purely optional and ONLY relevant for Rewards, the app can be used without providing CC information**\n**Please See:https://lbry.io/faq/identity-requirements**";
    msg.channel.send(message);
  }
};

exports.verify = {
  usage: " ",
  description: "How to Verify?",
  process: function(bot, msg) {
    const embed = {
      description:
        "Please download the latest version from [HERE](https://lbry.io/get) Upon install, you'll be greeted with a welcome message. If you already had the App installed, then go to the wallet (bank icon in the top right) > Rewards - this should show your current status. New users will need to verify in order to access rewards. Type !cc or !verification for more information.",
      color: 7976557,
      author: {
        name: "How To Verify?",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.verification = {
  usage: " ",
  description: "Verification Help Message",
  process: function(bot, msg) {
    var message =
      "If you would like to be verified go to <#" +
      verificationChannel +
      ">.  After joining, post that you would like verification and a mod will get to your request as soon as possible. We appreciate your patience.  Only one account per person is allowed access to LBRY Rewards.  Check out our [YouTube Sync](https://lbry.io/faq/youtube) for assistance with the YouTube Sync rewards verification method.";
    msg.channel.send(message);
  }
};

exports.logfile = {
  usage: " ",
  description: "How to find LBRY-app Log File?",
  process: function(bot, msg) {
    const embed = {
      description:
        "You can find your log files by following the guide [HERE](https://lbry.io/faq/how-to-find-lbry-log-file)",
      color: 7976557,
      author: {
        name: "How to find my LogFile?",
        url: "https://lbry.io/faq/how-to-find-lbry-log-file",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.backup = {
  usage: " ",
  description: "How to Backup the Wallet",
  process: function(bot, msg) {
    const embed = {
      description:
        "Please see this guide on how to backup your wallet: [lbry.io/faq/how-to-backup-wallet](https://lbry.io/faq/how-to-backup-wallet)",
      color: 7976557,
      author: {
        name: "How to Backup my Wallet?",
        url: "https://lbry.io/faq/how-to-backup-wallet",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.startupissues = {
  usage: " ",
  description: "Startup Troubleshooting?",
  process: function(bot, msg) {
    const embed = {
      description:
        "Please see [lbry.io/faq/startup-troubleshooting](https://lbry.io/faq/startup-troubleshooting) if you are having trouble getting LBRY to start correctly.",
      color: 7976557,
      author: {
        name: "Startup Troubleshooting",
        url: "https://lbry.io/faq/startup-troubleshooting",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.streamingissues = {
  usage: " ",
  description: "Unable To Stream?",
  process: function(bot, msg) {
    const embed = {
      description:
        "Please see [lbry.io/faq/unable-to-stream](https://lbry.io/faq/unable-to-stream) if you are experiencing problems viewing **ANY** LBRY content.",
      color: 7976557,
      author: {
        name: "Streaming Troubleshooting",
        url: "https://lbry.io/faq/unable-to-stream",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.ports = {
  usage: " ",
  description: "LBRY Ports",
  process: function(bot, msg) {
    const embed = {
      description:
        "The daemon uses ports **3333** and **4444**. May interfere with mining software. Start miner after the app and you should be okay. Also these ports need to be port forwarded on your router. Google is your friend there. \n **Please see this tutorial on how to change ports : [lbry.io/faq/how-to-change-port](https://lbry.io/faq/how-to-change-port)**",
      color: 7976557,
      author: {
        name: "Ports",
        url: "https://lbry.io/faq/how-to-change-port",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.migrate = {
  usage: " ",
  description: "How to Migrate your Wallet/Data",
  process: function(bot, msg) {
    const embed = {
      description:
        "Please see [lbry.io/faq/backup-data](https://lbry.io/faq/backup-data) for instructions on how to backup and/or migrate your LBRY data",
      color: 7976557,
      author: {
        name: "How To Backup/Migrate LBRY Data?",
        url: "https://lbry.io/faq/backup-data",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.tipping = {
  usage: " ",
  description: "Details About LBRY-app Tipping",
  process: function(bot, msg) {
    const embed = {
      description:
        "Please see [lbry.io/faq/tipping](https://lbry.io/faq/tipping) for details about tipping in the LBRY-App",
      color: 7976557,
      author: {
        name: "LBRY-App Tipping?",
        url: "https://lbry.io/faq/tipping",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.email = {
  usage: " ",
  description: "How to change Email in LBRY-app?",
  process: function(bot, msg) {
    const embed = {
      description:
        "If you need to change your LBRY connected email, please see instructions [HERE](https://lbry.io/faq/how-to-change-email)",
      color: 7976557,
      author: {
        name: "LBRY-App Change connected E-mail?",
        url: "https://lbry.io/faq/how-to-change-email",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.cli = {
  usage: " ",
  description: "How to interact with LBRY CLI?",
  process: function(bot, msg) {
    const embed = {
      description:
        "If you are interested in interacting with the LBRY protocol via commands, check out [lbry.io/faq/how-to-cli](https://lbry.io/faq/how-to-cli)",
      color: 7976557,
      author: {
        name: "Interact with the LBRY CLI",
        url: "https://lbry.io/faq/how-to-cli",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.ipfstorrent = {
  usage: " ",
  description: "How is LBRY different from IPFS / BitTorrent?",
  process: function(bot, msg) {
    const embed = {
      description:
        "If you are interested in how LBRY is different from IPFS or BitTorrent, check out [lbry.io/faq/different-ipfs](https://lbry.io/faq/different-ipfs)",
      color: 7976557,
      author: {
        name: "How is LBRY different from IPFS / BitTorrent?",
        url: "https://lbry.io/faq/different-ipfs",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.shapeshift = {
  usage: " ",
  description: "How can I convert my crypto into LBC?",
  process: function(bot, msg) {
    const embed = {
      description:
        "Please see this guide on how to convert your crypto into LBC: [lbry.io/faq/shapeshift](https://lbry.io/faq/shapeshift)",
      color: 7976557,
      author: {
        name: "How can I convert my crypto into LBC?",
        url: "https://lbry.io/faq/shapeshift",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};

exports.youtube = {
  usage: " ",
  description: "What is YouTube Sync?",
  process: function(bot, msg) {
    const embed = {
      description:
        "Please see this guide on how youtube sync works, check out [lbry.io/faq/youtube](https://lbry.io/faq/youtube)",
      color: 7976557,
      author: {
        name: "What is YouTube Sync?",
        url: "https://lbry.io/faq/youtube",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};
exports.transactions = {
  usage: " ",
  description: "What types of LBRY transactions are there?",
  process: function(bot, msg) {
    const embed = {
      description:
        "Please see this guide on [transaction types](https://lbry.io/faq/transaction-types)",
      color: 7976557,
      author: {
        name: "What types of LBRY transactions are there?",
        url: "https://lbry.io/faq/transaction-types",
        icon_url: "https://i.imgur.com/yWf5USu.png"
      }
    };
    msg.channel.send({
      embed
    });
  }
};
exports.tipbot = {
  usage: " ",
  description: "Tipbot Help Message",
  process: function(bot, msg) {
    var message =
      "Type !tip help to interact with our Tipbot which can be used to send and receive LBRY Credits (LBC) go to <#" +
      bot-sandboxChannel +
      ">.  After joining,please type `!tip help` for more assistance. This channel should be used to talk to bots in order to avoid spamming other channels.";
    msg.channel.send(message);
  }
};


