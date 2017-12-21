let inPrivate = require("../helpers.js").inPrivate;
let responseDebug = true;
exports.custom = [
  "lbrylink" //change this to your function name
];

exports.lbrylink = function(bot, msg, suffix) {
  bot.on("message", msg => {
    if (inPrivate(msg)) {
      return;
    }
    var link = msg.content.includes("lbry://");
    if (link) {
      var text = msg.content.replace("lbry://", "https://open.lbry.io/");
      var message = text.match(/\bhttps?:\/\/\S+/gi).toString();
      var check1 = message.includes(">");
      if (responseDebug) {
        console.log("Link = " + link);
        console.log("text = " + text);
        console.log("message = " + message);
        console.log("check1 = " + check1);
      }
      if (message == "https://open.lbry.io/") {
        return;
      }
      if (check1 === true) {
        parsename = message.split(">").pop();
        message = "https://open.lbry.io" + parsename;
        var newname = message.match(/\bhttps?:\/\/\S+/gi);
        if (responseDebug) {
          console.log("Username Provided!");
          console.log("parsename = " + parsename);
          console.log("message = " + message);
          console.log("newname = " + newname);
        }
        if (!parsename.startsWith("/")) {
          parsename2 = parsename.split("/").pop();
          message = "https://open.lbry.io/" + parsename2;
          newname = message.match(/\bhttps?:\/\/\S+/gi);
          if (responseDebug) {
            console.log("Username no / check");
            console.log("parsename2 = " + parsename2);
            console.log("message = " + message);
            console.log("newname = " + newname);
          }
          if (
            newname == "https://open.lbry.io/" ||
            parsename2.startsWith("#")
          ) {
            return;
          }
        }
        if (newname == "https://open.lbry.io") {
          return;
        }
      } else {
        var newname = message;
        if (newname == "https://open.lbry.io/") {
          return;
        }
        if (responseDebug) {
          console.log("message = " + message);
          console.log("newname = " + newname);
        }
      }
      const embed = {
        description:
          "I see you tried to post a LBRY URL, here's a friendly hyperlink to share and for others to access your content with a single click: \n" +
          newname,
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
