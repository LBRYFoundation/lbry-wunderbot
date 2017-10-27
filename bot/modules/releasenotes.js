var request = require('request');
let hasPerms = require('../helpers.js').hasPerms;


exports.commands = [
	"releasenotes" // command that is in this file, every command needs it own export as shown below
]


exports.releasenotes = {
	usage: "",
	description: 'gets current release notes from GITHUB',
	process: function(bot,msg,suffix){	
		
		var headers = {
			'Content-Type': 'application/json',
			'User-Agent':       'Super Agent/0.0.1'
			}
		// Configure the request
		var options = {
			url: 'https://api.github.com/repos/lbryio/lbry-app/releases/latest',
			method: 'GET',
			headers: headers,
		}

		// Start the request
		request(options, function (error, response, body) {
				releasemessage = JSON.parse(body).body
				releasename = JSON.parse(body).name
				releasedate = JSON.parse(body).published_at
				releaseurl = JSON.parse(body).html_url
				message = {"embed": {"title": "*Download " + releasename + " here!*","description": releasemessage,"url": releaseurl,"color": 7976557,"timestamp": releasedate,"author": {"name": "Lbry-app Release Notes for " + releasename,"icon_url": "http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png"},"footer": {"icon_url": "https://i.imgur.com/yWf5USu.png","text": "Lbry-app Updated "}}}
				if ( hasPerms(msg) === true && suffix === "post")  {
					var channelID = "324400517075959808"
					bot.channels.get(channelID).send(message)
				} else {
				msg.channel.send(msg.author + " Release notes sent via DM")
				msg.author.send(message)
				}
		})
			
    }
}
