exports.custom = [
    "onUserJoin"
]
exports.onUserJoin = function(bot) {

	bot.on('guildMemberAdd', member => {
	   member.send(
	   "**Welcome to Lbry Discord!** \n" +
	   "Please respect everyone in the community \n" +
	   "1. No begging for Free Coins \n" +
	   "2. **No Harrasing** other community members this includes any **racist comments** in the server! \n" +
	   "3. Dont be Afraid to ask questions, please use proper channels when doing so \n" +
	   "   we have dedicated channels like ***#feedback-and-ideas #mining #market-and-trading #random** for your needs \n" +
	   "4. If you need help please use the channel #help and someone will assist you \n" + 
	   "5. **#general** is to be used for general talk about lbry off-topic stuff find the right channel please \n" +
	   "**If your here for *Verification* please go to **#verification** channel and post you'd like to be verified and mod will get to you asap, please be patient as we are not up 24/7 to monitor all activity in that channel** \n" +
	   "\n\n" +
	   "*NOTE: the platform is in Beta, you may encounter bugs or errors, we are aware of most issues please check our github(https://github.com/lbryio/lbry-app/issues) for issues that you may come across before reoprting it, thanks for your time and patience*"
	   );
	   member.send(
	   {
	  "embed": {
		"title": "*Click Here for more Info!*",
		"description": "[**LBRY**](https://lbry.io) is a protocol providing fully decentralized network for the discovery, distribution, and payment of data. It utilizes the [**LBRY blockchain**](https://lbry.io/what#the-network) as a global namespace and database of digital content. Blockchain entries contain searchable content metadata, identities, and rights and access rules. \n[_**Get the App here**_](https://lbry.io/get)",
		"url": "https://lbry.io/what",
		"color": 7976557,
		"author": {
		  "name": "What is LBRY?",
		  "url": "https://lbry.io/what",
		  "icon_url": "https://i.imgur.com/yWf5USu.png"
		}
	  }
	});
});

}
