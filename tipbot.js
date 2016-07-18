var lbry;

var command = '!tip';

module.exports={
  command: command,
  init: init,
  respond: respond
};

function init(rpcuser, rpcpassword) {
  if (lbry) {
    throw new Error('init was already called once');
  }

  var bitcoin = require('bitcoin');
  lbry = new bitcoin.Client({
    host: 'localhost',
    'port': 9245,
    'user': rpcuser,
    'pass': rpcpassword
  });
}

var globalSlackParams = {
  icon_emoji: ':money_with_wings:'
};

function respond(bot, data) {
  var tipper = data.user,
      channel = data.channel,
      words = data.text.trim().split(' ');

  if (!lbry) {
    bot.postMessage(channel, 'Failed to connect to lbrycrd', {icon_emoji: ':exclamation:'});
    return;
  }

  if (words[0] !== command) {
    // wtf?
    return;
  }

  var subcommand = words.length >= 2 ? words[1] : 'help';

  if (subcommand === 'help') {
    doHelp(bot, channel);
  }
  else if (subcommand === 'balance') {
    doBalance(bot, channel, tipper);
  }
  else if (subcommand === 'deposit') {
    doDeposit(bot, channel, tipper);
  }
  else if (subcommand === 'withdraw') {
    doWithdraw(bot, channel, tipper, words);
  }
  else {
    doTip(bot, channel, tipper, words);
  }
}



function doBalance(bot, channel, tipper) {
  lbry.getBalance(tipper, 1, function(err, balance) {
    if (err) {
      bot.postMessage(channel, '<@' + tipper + '>: Error getting balance', {icon_emoji: ':exclamation:'});
    }
    else {
      bot.postMessage(channel, '<@' + tipper + '>: You have *' + balance + '* LBC', globalSlackParams);
    }
  });
}


function doDeposit(bot, channel, tipper) {
  getAddress(tipper, function(err, address) {
    if (err) {
      bot.postMessage(channel, '<@' + tipper + '>: Error getting deposit address', {icon_emoji: ':exclamation:'});
    }
    else {
      bot.postMessage(channel, '<@' + tipper + '>: Your address is ' + address, globalSlackParams);
    }
  });
}


function doWithdraw(bot, channel, tipper, words) {
  if (words.length < 4) {
    doHelp(bot, channel);
    return;
  }

  var address = words[2],
      amount = words[3];

  if (!validateAmount(amount)) {
    bot.postMessage(channel, '<@' + tipper + '>: I dont know how to withdraw that many credits', globalSlackParams);
    return;
  }

  lbry.sendFrom(tipper, address, amount, function(err, txId) {
    if (err) {
      bot.postMessage(channel, err.message);
    }
    else {
      bot.postMessage(channel, '<@' + tipper + '>: You withdrew ' + amount + ' to ' + address + ' (' + txLink(txId) + ')', globalSlackParams);
    }
  });
}


function doTip(bot, channel, tipper, words) {
  if (words.length < 3) {
    doHelp(bot, channel);
    return;
  }

  var user = words[1],
      amount = words[2];

  if (!validateAmount(amount)) {
    bot.postMessage(channel, '<@' + tipper + '>: I dont know how to tip that many credits', globalSlackParams);
    return;
  }

  if (user.match(/^<@U[^>]+>$/)) {
    var id = user.substr(2,user.length-3);
    sendLbc(bot, channel, tipper, id, amount);
  }
  else {
    bot.getUser(user).then(function(data) {
      if (data.id) {
        sendLbc(bot, channel, tipper, data.id, amount);
      } else
      {
        bot.postMessage(channel, '<@' + tipper + '>: Sorry, I dont know that person', globalSlackParams);
      }
    })
  }
}


function doHelp(bot, channel) {
  bot.postMessage(channel,
    '`' + command + ' help`: this message\n' +
    '`' + command + ' balance`: get your balance\n' +
    '`' + command + ' deposit`: get address for deposits\n' +
    '`' + command + ' withdraw ADDRESS AMOUNT`: withdraw AMOUNT credits to ADDRESS\n' +
    '`' + command + ' USER AMOUNT`: send AMOUNT credits to USER\n' +
    '\n' +
    'Send me a Direct Message if you want to interact privately.\n' +
    'If I\'m not responding in some channel, you can invite me by @mentioning me\n'
  , globalSlackParams);
}


function sendLbc(bot, channel, tipper, id, amount) {
  getAddress(id, function(err, address){
    if (err){
      bot.postMessage(channel, err.message);
    }
    else {
      lbry.sendFrom(tipper, address, amount, 1, null, null, function(err, txId){
        if (err) {
          bot.postMessage(channel, err.message);
        }
        else {
          bot.postMessage(channel, 'Wubba lubba dub dub! <@' + tipper + '> tipped <@' + id + '> ' + amount + ' LBC (' + txLink(txId) + ')', globalSlackParams);
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


function validateAmount(amount) {
  return amount.match(/^[0-9]+(\.[0-9]+)?$/);
}


function txLink(txId) {
  return "<https://explorer.lbry.io/tx/" + txId + "|tx>";
}
