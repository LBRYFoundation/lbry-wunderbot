'use strict';

exports.commands = [
	"speech"
]

exports.init = function(bot){
	console.log(bot);
}

exports.speech = {
	usage: "<claim>",
	description: 'Speech coming soon...',
	process: function(bot,msg,suffix){
		console.log("user " + msg.member.user.username + " used !speech command");
		if (suffix === "help") {
		  msg.channel.send(
		  	   {
	  "embed": {
		"title": "Speech bot help",
		"description": '**!speech `<Name>`** : *displays top claim on speech* \n' +
    '**!speech `<Name> <URL> <NSFW>`** : *Uploads Image URL to Spee.ch* \n' +
    '**NOTE : dont include spaces in name (NSFW is optional true/false, if left blank will defualt to false)** \n' +
	'EXAMPLE : `!speech my-image-name https://url/to/image.png false`',
		"color": 7976557,
		"author": {
		  "name": "COMING SOON!!",
		  "icon_url": "https://i.imgur.com/yWf5USu.png"
		}
	  }
	}
	)
	} else { msg.channel.send("**COMING SOON**"); };
	}
}
