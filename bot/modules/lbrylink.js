
exports.custom = [
    "lbrylink" //change this to your function name
]

exports.lbrylink = function(bot,msg,suffix) {
  bot.on('message', msg => {
    var link = msg.content.indexOf("lbry://")
    if (link != -1) {
    var text = msg.content.replace("lbry://", "https://open.lbry.io/");
    var message = GetWordByPos(text, link)
    var name = message.replace("https://open.lbry.io/", "");
    const embed = {
					"description": msg.author+", I see you tried to post a LBRY URL, here's a friendly hyperlink to share and for others to access your content with a single click: \n"+"[lbry://"+name+"]("+message+")",
					"color": 7976557,
					"author": {
					     "name": "LBRY Linker",
					     "icon_url": "https://i.imgur.com/yWf5USu.png"
							}
					};
    msg.channel.send({embed})
  }
})
function GetWordByPos(str, pos) {
    var left = str.substr(0, pos);
    var right = str.substr(pos);

    left = left.replace(/^.+ /g, "");
    right = right.replace(/ .+$/g, "");

    return left + right;
}
}
