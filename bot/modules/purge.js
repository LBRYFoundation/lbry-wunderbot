let hasPerms = require('../helpers.js').hasPerms;
let inPrivate = require('../helpers.js').inPrivate;
 
  exports.commands = [
	"purge" // command that is in this file, every command needs it own export as shown below
]

exports.purge = {
	usage: "<number of messages>",
	description: 'Deletes Messages',
	process: function(bot,msg,suffix){
		if (inPrivate(msg)) {
			msg.channel.send("You Cant Purge Message In DM's!");
			return
		}
		if (hasPerms(msg)) {
		  if (!suffix) {
		   var newamount = "2"
		   } else {
			var amount = Number(suffix)
			var adding = 1
			var newamount = amount + adding
			}
		    let messagecount = newamount.toString();
			msg.channel.fetchMessages({limit: messagecount})
          .then(messages => {
            msg.channel.bulkDelete(messages);
            // Logging the number of messages deleted on both the channel and console.
            msg.channel
			.send("Deletion of messages successful. \n Total messages deleted including command: "+ newamount)
			.then(message => message.delete(5000));
            console.log('Deletion of messages successful. \n Total messages deleted including command: '+ newamount)
          })
          .catch(err => {
            console.log('Error while doing Bulk Delete');
            console.log(err);
          });
		} else {
				msg.channel
				.send('only moderators can use this command!')
				.then(message => message.delete(5000));
		}
	}
}
