let inPrivate = require("../helpers.js").inPrivate;
let ResponseDebug = "false";
exports.custom = [
  "lbrylink" //change this to your function name
];

exports.lbrylink = function(bot, msg, suffix) {
  bot.on("message", msg => {
    if (inPrivate(msg)) {
      return;
    }
    var link = msg.content.indexOf("lbry://");
    if (link != -1) {
      var text = msg.content.replace("lbry://", "https://open.lbry.io/");
      var message = GetWordByPos(text, link);
        if (ResponseDebug == "true") {
          console.log("text = " + text);
          console.log("message = " + message);
        }
      if (message === "https://open.lbry.io/") {
        return;
      }
      if (message.search(">") != -1) {
        parsename = message.split(">").pop();
        if (parsename.search("/") == -1){
          return;
        }
        newname = message.split("/").pop();
        message = "https://open.lbry.io/" + newname;
          if (ResponseDebug == "true") {
            console.log("Username Provided!");
            console.log("parsename = " + parsename);
            console.log("newname = " + newname);
          }
      } else {
        var newname = message.replace("https://open.lbry.io/", "");
      }
      const embed = {
        description:
          "I see you tried to post a LBRY URL, here's a friendly hyperlink to share and for others to access your content with a single click: \n" +
          "[lbry://" +
          newname +
          "](" +
          message +
          ")",
        color: 7976557,
        author: {
          name: "LBRY Linker",
          icon_url: "https://i.imgur.com/yWf5USu.png"
        }
      };
      msg.channel.send({
        embed
      });
    }

    function GetWordByPos(str, pos) {
      var left = str.substr(0, pos);
      var right = str.substr(pos);

      left = left.replace(/^.+ /g, "");
      right = right.replace(/ .+$/g, "");

      return left + right;
    }
  });
};
