let inPrivate = require("../helpers.js").inPrivate;

exports.custom = [
  "lbrylink" //change this to your function name
];

exports.lbrylink = function(bot, msg, suffix) {
  bot.on("message", msg => {
    if (inPrivate(msg)) {
      return;
    }
    var link = msg.content.indexOf("lbry://");
    console.log(link);
    if (link != -1) {
      var text = msg.content.replace("lbry://", "https://open.lbry.io/");
      console.log(text);
      var message = GetWordByPos(text, link);
      if (message === "https://open.lbry.io/") {
        return;
      }
      if (message.search("<") != -1) {
        var name = "@" + msg.mentions.members.first().user.username;
        var trim = message.split("/").pop();
        var trim2 = trim.substr(2);
        var id = trim2.substr(0, trim2.length - 1);
        if (message.indexOf("#") != -1) {
          if (trim.indexOf("@") != -1) {
            var trim3 = message.split("#").pop();
            var message = "https://open.lbry.io/" + name + "#" + trim3;
            var newname = name + "#" + trim3;
          } else {
            var trim3 = message.split("/").pop();
            var done = trim3;
            var message = "https://open.lbry.io/" + name + "/" + done;
            var newname = name + "/" + done;
          }
        } else {
          if (msg.mentions.members.first().id != id) {
            var message =
              "https://open.lbry.io/@" +
              msg.mentions.members.first().user.username +
              "/" +
              message.split("/").pop();
            var newname = name + "/" + message.split("/").pop();
          } else {
            var message =
              "https://open.lbry.io/@" +
              msg.mentions.members.first().user.username;
            var newname = name;
          }
        }
      } else {
        var newname = message.replace("https://open.lbry.io/", "");
      }
      const embed = {
        description:
          msg.author +
          ", I see you tried to post a LBRY URL, here's a friendly hyperlink to share and for others to access your content with a single click: \n" +
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
