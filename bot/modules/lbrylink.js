exports.custom = [
    "lbrylink" //change this to your function name
]

exports.lbrylink = function(bot,msg,suffix) {
  bot.on('message', msg => {
    if (msg.content.indexOf("lbry://") != -1) {
    var text = msg.content.replace("lbry://", "https://open.lbry.io/");
    msg.delete(500);
    msg.reply(" I see you tried to Post a LBRY link let me help you with that:\n\n"+text)
  }
})
}
