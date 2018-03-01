let needle = require("needle");
let config = require("config");
let hasHashBotChannels = require("../helpers.js").hasHashBotChannels;
let inPrivate = require("../helpers.js").inPrivate;
let ChannelID = config.get("hashbot").mainchannel;
exports.commands = [
  "hash" // command that is in this file, every command needs it own export as shown below
];

exports.custom = ["timedhash"];

exports.timedhash = function(bot) {
  setInterval(function() {
    sendMiningInfo(bot);
  }, 6 * 60 * 60 * 1000);

  function sendMiningInfo(bot) {
    needle.get("https://explorer.lbry.io/api/v1/status", function(
      error,
      response
    ) {
      if (error || response.statusCode !== 200) {
        msg.channel.send("Explorer API is not available");
      } else {
        var data = response.body;
        var height = Number(data.status.height);
        var hashrate = data.status.hashrate;
        var difficulty = Number(data.status.difficulty);
        needle.get("https://whattomine.com/coins/164.json", function(
          error,
          response
        ) {
          if (error || response.statusCode !== 200) {
            msg.channel.send("whattomine API is not available");
          }
          var data = response.body;
          var reward = Number(data.block_reward);
          var block_time = Number(data.block_time);
          var difficulty24 = Number(data.difficulty24);
          description =
            "Hashrate: " +
            numberWithCommas(hashrate) +
            "\n" +
            "Difficulty: " +
            numberWithCommas(difficulty.toFixed(0)) +
            "\n" +
            "Difficulty 24 Hour Average: " +
            numberWithCommas(difficulty24.toFixed(0)) +
            "\n" +
            "Current block: " +
            numberWithCommas(height.toFixed(0)) +
            "\n" +
            "Block Time: " +
            numberWithCommas(block_time.toFixed(0)) +
            " seconds \n" +
            "Block Reward: " +
            numberWithCommas(reward.toFixed(0)) +
            " LBC \n" +
            "Sources: https://explorer.lbry.io & \n" +
            "https://whattomine.com/coins/164-lbc-lbry";
          const embed = {
            description: description,
            color: 7976557,
            author: {
              name: "LBRY Network Stats",
              icon_url: "https://i.imgur.com/yWf5USu.png"
            }
          };
          bot.channels.get(ChannelID).send({ embed });
          return;
        });
      }
    });
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};


exports.hash = {
  usage: "",
  description:
    "Displays current Hashrate of Network\n**!hash power <Mh/s> <fait>**\n  Displays potential Earnings For Given Hashrate\n **Supported Currencies:** *usd*, *eur*, *gbp*, *aud*, *brl*, *cad*, *chf*, *clp*, *cny*, *czk*, *dkk*, *hkd*, *huf*, *idr*, *ils*, *inr*, *jpy*, *krw*, *mxn*, *myr*, *nok*, *nzd*, *php*, *pkr*, *pln*, *rub*, *sek*, *sgd*, *thb*, *try*, *twd*, *zar* (case-insensitive)",
  process: function(bot, msg, suffix) {
    var command = "!hash";
    words = suffix
      .trim()
      .split(" ")
      .filter(function(n) {
        return n !== "";
      });
    profitcommand = words[0];
    myhashrate = words[1];
    console.log(suffix);
    if (profitcommand == "power") {
      sendProfitInfo(bot, msg, suffix);
      return;
    } else {
      sendMiningInfo(bot, msg, suffix);
      return;
    }

    function sendMiningInfo(bot, msg, suffix) {
      if (!inPrivate(msg) && !hasHashBotChannels(msg)) {
        msg.channel.send(
          "Please use <#" + ChannelID + "> or DMs to talk to hash bot."
        );
        return;
      }
      needle.get("https://explorer.lbry.io/api/v1/status", function(
        error,
        response
      ) {
        if (error || response.statusCode !== 200) {
          msg.channel.send("Explorer API is not available");
        } else {
          var data = response.body;
          var height = Number(data.status.height);
          var hashrate = data.status.hashrate;
          var difficulty = Number(data.status.difficulty);
          needle.get("https://whattomine.com/coins/164.json", function(
            error,
            response
          ) {
            if (error || response.statusCode !== 200) {
              msg.channel.send("whattomine API is not available");
            }
            var data = response.body;
            var reward = Number(data.block_reward);
            var block_time = Number(data.block_time);
            var difficulty24 = Number(data.difficulty24);
            description =
              "Hashrate: " +
              numberWithCommas(hashrate) +
              "\n" +
              "Difficulty: " +
              numberWithCommas(difficulty.toFixed(0)) +
              "\n" +
              "Difficulty 24 Hour Average: " +
              numberWithCommas(difficulty24.toFixed(0)) +
              "\n" +
              "Current block: " +
              numberWithCommas(height.toFixed(0)) +
              "\n" +
              "Block Time: " +
              numberWithCommas(block_time.toFixed(0)) +
              " seconds \n" +
              "Block Reward: " +
              numberWithCommas(reward.toFixed(0)) +
              " LBC \n" +
              "Sources: https://explorer.lbry.io & \n" +
              "https://whattomine.com/coins/164-lbc-lbry";
            const embed = {
              description: description,
              color: 7976557,
              author: {
                name: "LBRY Network Stats",
                icon_url: "https://i.imgur.com/yWf5USu.png"
              }
            };
            msg.channel.send({ embed });
            return;
          });
        }
      });
    }
    function sendProfitInfo(bot, msg, suffix) {
      words = suffix
        .trim()
        .split(" ")
        .filter(function(n) {
          return n !== "";
        });
      var myhashrate = words[1];
      if (
        myhashrate == "" ||
        myhashrate == null ||
        myhashrate == undefined ||
        myhashrate == " "
      ) {
        myhashrate = "100";
      }
      var otherfiat = words[2];
      if (
        otherfiat == "" ||
        otherfiat == null ||
        otherfiat == undefined ||
        otherfiat == " "
      ) {
        otherfiat = "USD";
      }
      var cmcurl =
        "https://api.coinmarketcap.com/v1/ticker/library-credit/?convert=" +
        otherfiat;
      needle.get(cmcurl, function(error, response) {
        if (error || response.statusCode !== 200) {
          msg.channel.send("coinmarketcap API is not available");
        } else {
          var data = response.body[0];
          if (otherfiat == "USD" || otherfiat == "usd") {
            var Otherprice = response.body[0].price_usd;
            var sign = "$";
          }
          if (otherfiat == "AUD" || otherfiat == "aud") {
            var Otherprice = response.body[0].price_aud;
            var sign = "AU$";
          }
          if (otherfiat == "BRL" || otherfiat == "brl") {
            var Otherprice = response.body[0].price_brl;
            var sign = "R$";
          }
          if (otherfiat == "CAD" || otherfiat == "cad") {
            var Otherprice = response.body[0].price_cad;
            var sign = "Can$";
          }
          if (otherfiat == "CHF" || otherfiat == "chf") {
            var Otherprice = response.body[0].price_chf;
            var sign = "Fr";
          }
          if (otherfiat == "CLP" || otherfiat == "clp") {
            var Otherprice = response.body[0].price_clp;
            var sign = "CLP$";
          }
          if (otherfiat == "CNY" || otherfiat == "cny") {
            var Otherprice = response.body[0].price_cny;
            var sign = "¥";
          }
          if (otherfiat == "CZK" || otherfiat == "czk") {
            var Otherprice = response.body[0].price_czk;
            var sign = "Kč";
          }
          if (otherfiat == "DKK" || otherfiat == "dkk") {
            var Otherprice = response.body[0].price_dkk;
            var sign = "kr";
          }
          if (otherfiat == "EUR" || otherfiat == "eur") {
            var Otherprice = response.body[0].price_eur;
            var sign = "€";
          }
          if (otherfiat == "GBP" || otherfiat == "gbp") {
            var Otherprice = response.body[0].price_gbp;
            var sign = "£";
          }
          if (otherfiat == "HKD" || otherfiat == "hkd") {
            var Otherprice = response.body[0].price_hkd;
            var sign = "HKD$";
          }
          if (otherfiat == "HUF" || otherfiat == "huf") {
            var Otherprice = response.body[0].price_huf;
            var sign = "Ft";
          }
          if (otherfiat == "IDR" || otherfiat == "idr") {
            var Otherprice = response.body[0].price_idr;
            var sign = "Rp";
          }
          if (otherfiat == "ILS" || otherfiat == "ils") {
            var Otherprice = response.body[0].price_ils;
            var sign = "₪";
          }
          if (otherfiat == "INR" || otherfiat == "inr") {
            var Otherprice = response.body[0].price_inr;
            var sign = "₹";
          }
          if (otherfiat == "JPY" || otherfiat == "jpy") {
            var Otherprice = response.body[0].price_jpy;
            var sign = "¥";
          }
          if (otherfiat == "KRW" || otherfiat == "krw") {
            var Otherprice = response.body[0].price_krw;
            var sign = "‎₩";
          }
          if (otherfiat == "MXN" || otherfiat == "mxn") {
            var Otherprice = response.body[0].price_mxn;
            var sign = "MXN$";
          }
          if (otherfiat == "MYR" || otherfiat == "myr") {
            var Otherprice = response.body[0].price_myr;
            var sign = "RM";
          }
          if (otherfiat == "NOK" || otherfiat == "nok") {
            var Otherprice = response.body[0].price_nok;
            var sign = "kr";
          }
          if (otherfiat == "NZD" || otherfiat == "nzd") {
            var Otherprice = response.body[0].price_nzd;
            var sign = "NZD$";
          }
          if (otherfiat == "PHP" || otherfiat == "php") {
            var Otherprice = response.body[0].price_php;
            var sign = "₱";
          }
          if (otherfiat == "PKR" || otherfiat == "pkr") {
            var Otherprice = response.body[0].price_pkr;
            var sign = "₨";
          }
          if (otherfiat == "PLN" || otherfiat == "pln") {
            var Otherprice = response.body[0].price_pln;
            var sign = "zł";
          }
          if (otherfiat == "RUB" || otherfiat == "rub") {
            var Otherprice = response.body[0].price_rub;
            var sign = "₽";
          }
          if (otherfiat == "SEK" || otherfiat == "sek") {
            var Otherprice = response.body[0].price_sek;
            var sign = "kr";
          }
          if (otherfiat == "SGD" || otherfiat == "sgd") {
            var Otherprice = response.body[0].price_sgd;
            var sign = "S$";
          }
          if (otherfiat == "THB" || otherfiat == "thb") {
            var Otherprice = response.body[0].price_thb;
            var sign = "฿";
          }
          if (otherfiat == "TRY" || otherfiat == "try") {
            var Otherprice = response.body[0].price_try;
            var sign = "₺";
          }
          if (otherfiat == "TWD" || otherfiat == "twd") {
            var Otherprice = response.body[0].price_twd;
            var sign = "NT$";
          }
          if (otherfiat == "ZAR" || otherfiat == "zar") {
            var Otherprice = response.body[0].price_zar;
            var sign = "R";
          }
          var myRate = Number(Otherprice);
          needle.get("https://whattomine.com/coins/164.json", function(
            error,
            response
          ) {
            if (error || response.statusCode !== 200) {
              msg.channel.send("whattomine API is not available");
            } else {
              var Diff = response.body.difficulty24;
              var Reward = response.body.block_reward;
              var myHash = Number(myhashrate);
              var LBC = myHash / 2000 * (1 / ((Diff * 2) ^ 32) * Reward) * 3600;
              var LBC24 =
                myHash / 2000 * (1 / ((Diff * 2) ^ 32) * Reward) * 86400;
              var LBC1w =
                myHash / 2000 * (1 / ((Diff * 2) ^ 32) * Reward) * 604800;
              var LBC1m =
                myHash / 2000 * (1 / ((Diff * 2) ^ 32) * Reward) * 2628000;
              var Other = myRate * LBC;
              var Other24 = myRate * LBC24;
              var Other1w = myRate * LBC1w;
              var Other1m = myRate * LBC1m;
              var message =
                "With **" +
                myHash +
                " Mh/s** and Average 24 hour Difficulty: **" +
                Diff.toFixed(0) +
                "**\nYou can potentially earn the following: \n";
              var lbcrates =
                "1 Hour = **" +
                LBC.toFixed(4) +
                "** \n" +
                "1 Day = **" +
                LBC24.toFixed(2) +
                "** \n" +
                "1 Week = **" +
                LBC1w.toFixed(4) +
                "** \n" +
                "1 Month = **" +
                LBC1m.toFixed(4) +
                "** \n";
              var otherrates =
                "1 Hour = **" +
                sign +
                " " +
                Other.toFixed(2) +
                "** \n" +
                "1 Day = **" +
                sign +
                " " +
                Other24.toFixed(2) +
                "** \n" +
                "1 Week = **" +
                sign +
                " " +
                Other1w.toFixed(2) +
                "** \n" +
                "1 Month = **" +
                sign +
                " " +
                Other1m.toFixed(2) +
                "** \n";
              const embed = {
                description: message,
                color: 7976557,
                author: {
                  name: "Hashing Power Calculator!",
                  icon_url: "https://i.imgur.com/nKHVQgq.png"
                },
                fields: [
                  {
                    name: "LBC Rates",
                    value: lbcrates,
                    inline: true
                  },
                  {
                    name: otherfiat.toUpperCase() + " (" + sign + ") Rates",
                    value: otherrates,
                    inline: true
                  }
                ]
              };
              msg.channel.send({ embed });
              return;
            }
          });
        }
      });
    }
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};
