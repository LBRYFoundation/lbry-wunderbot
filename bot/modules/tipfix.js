'use strict';
exports.commands = ['tip'];
exports.tip = {
  usage: '<subcommand>',
  description: 'balance: get your balance\n    deposit: get address for your deposits\n    withdraw ADDRESS AMOUNT: withdraw AMOUNT credits to ADDRESS\n    <user> <amount>: mention a user with @ and then the amount to tip them',
  process: function(bot) {
    return; // Tipping is now handled by the separate tipbot(in branch tipbot_dc), no need to to anything here...
  }
};
