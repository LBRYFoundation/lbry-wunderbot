'use strict';

const bitcoin = require('bitcoin');
let config = require('config');
config = config.get('lbrycrd');
const lbry = new bitcoin.Client(config);

exports.commands = [
	"tip"
]
exports.tip = {
	usage: "<subcommand>",
	description: 'balance: get your balance\n    deposit: get adress for your deposits\n    withdraw ADDRESS AMOUNT: withdraw AMOUNT credits to ADDRESS\n    <user> <amount>: mention a user with @ and then the amount to tip them',
	process: async function(bot,msg,suffix){
        let tipper = msg.author.id,
            words = msg.content.trim().split(' ').filter( function(n){return n !== "";} ),
            subcommand = words.length >= 2 ? words[1] : 'help';
        if (subcommand === 'help') {
          doHelp(msg);
        }
        else if (subcommand === 'balance') {
          doBalance(msg, tipper);
        }
        else if (subcommand === 'deposit') {
          doDeposit(msg, tipper);
        }
        else if (subcommand === 'withdraw') {
          doWithdraw(msg, tipper, words);
        }
        else {
          doTip(msg, tipper, words);
        }
	}
}


function doBalance(message, tipper) {
  lbry.getBalance(tipper, 1, function(err, balance) {
    if (err) {
      message.reply('Error getting balance');
    }
    else {
      message.reply('You have *' + balance + '* LBC');
    }
  });
}


function doDeposit(message, tipper) {
  if(!inPrivateOrBotSandbox(message)){
    message.reply('Please use <#369896313082478594> or DMs to talk to bots.');
    return;
  }
  getAddress(tipper, function(err, address) {
    if (err) {
      message.reply('Error getting deposit address');
    }
    else {
      message.reply('Your address is ' + address);
    }
  });
}


function doWithdraw(message, tipper, words) {
  if(!inPrivateOrBotSandbox(message)){
    message.reply('Please use <#369896313082478594> or DMs to talk to bots.');
    return;
  }
  if (words.length < 4) {
    doHelp(message);
    return;
  }

  var address = words[2],
      amount = getValidatedAmount(words[3]);

  if (amount === null) {
    message.reply('I dont know how to withdraw that many credits');
    return;
  }

  lbry.sendFrom(tipper, address, amount, function(err, txId) {
    if (err) {
      message.reply(err.message);
    }
    else {
      message.reply('You withdrew ' + amount + ' to ' + address + ' (' + txLink(txId) + ')');
    }
  });
}


function doTip(message, tipper, words) {
  if (words.length < 3 || !words) {
    doHelp(message);
    return;
  }

  let amount = getValidatedAmount(words[2]);

  if (amount === null) {
    message.reply('I dont know how to tip that many credits');
    return;
  }

  if (words[1].match(/^<@[^>]+>$/)) {
    let id = words[1].substr(2,words[1].length-3);
    sendLbc(message, tipper, id, amount);
  }
  else
      {
        message.reply('Sorry, I could not find a user in your tip...');
      }
}


function doHelp(message) {
  if(!inPrivateOrBotSandbox(message)){
    message.reply('Please use <#369896313082478594> or DMs to talk to bots.');
    return;
  }
  message.reply('Sent you help via DM!');
  message.author.send('**!tip**\n    balance: get your balance\n    deposit: get adress for your deposits\n    withdraw ADDRESS AMOUNT: withdraw AMOUNT credits to ADDRESS\n    <user> <amount>: send <amount> credits to <user>');
}


function sendLbc(message, tipper, id, amount) {
  getAddress(id, function(err, address){
    if (err) {
      message.reply(err.message);
    }
    else {
      lbry.sendFrom(tipper, address, amount, 1, null, null, function(err, txId){
        if (err) {
          message.reply(err.message);
        }
        else {
          var imessage =
            'Wubba lubba dub dub! <@' + tipper + '> tipped <@' + id + '> ' + amount + ' LBC (' + txLink(txId) + '). ' +
            'DM me `!tip` for tipbot instructions.'
          message.reply(imessage);
        }
      });
    }
  });
};


function getAddress(userId, cb) {
  lbry.getAddressesByAccount(userId, function(err, addresses) {
    if (err) {
      cb(err);
    }
    else if(addresses.length > 0) {
      cb(null, addresses[0]);
    }
    else {
      lbry.getNewAddress(userId, function(err, address) {
        if (err) {
          cb(err);
        }
        else {
          cb(null, address);
        }
      });
    }
  });
}

function inPrivateOrBotSandbox(msg){
  if((msg.channel.type == 'dm') || (msg.channel.id === '369896313082478594')){
    return true;
  }else{
    return false;
  }
}

function getValidatedAmount(amount) {
  amount = amount.trim();
  if (amount.toLowerCase().endsWith('lbc')) {
    amount = amount.substring(0, amount.length-3);
  }
  return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
}


function txLink(txId) {
  return "<https://explorer.lbry.io/tx/" + txId + ">";
}
