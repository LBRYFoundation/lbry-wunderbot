"use strict";

let lbry;
let mongo;
let discordBot;
let moment = require("moment");
let request = require("request");
let sleep = require("sleep");
let config = require("config");
let channels = config.get("claimbot").channels;
const Discord = require("discord.js");
const rp = require("request-promise");
const jsonfile = require("jsonfile");
const path = require("path");
const fs = require("fs");
const appRoot = require("app-root-path");
const fileExists = require("file-exists");
module.exports = {
  init: init
};

function init(discordBot_) {
  if (lbry) {
    throw new Error("init was already called once");
  }

  discordBot = discordBot_;

  const MongoClient = require("mongodb").MongoClient;
  MongoClient.connect(config.get("mongodb").url, function(err, db) {
    if (err) {
      throw err;
    }
    mongo = db;

    console.log("Activating claimbot ");
    discordBot.channels.get(channels[0]).send("activating claimbot");

    // Check that our syncState file exist.
    fileExists(path.join(appRoot.path, "syncState.json"), (err, exists) => {
      if (err) {
        throw err;
      }
      if (!exists) {
        fs.writeFileSync(path.join(appRoot.path, "syncState.json"), "{}");
      }
    });
    setInterval(function() {
      announceClaims();
    }, 60 * 1000);
    announceClaims();
  });
}

async function announceClaims() {
  // get last block form the explorer API.
  let lastBlockHeight = JSON.parse(
    await rp("https://explorer.lbry.io/api/v1/status")
  ).status.height;
  // get the latest claims from chainquery since last sync
  let syncState = await getJSON(path.join(appRoot.path, "syncState.json")); // get our persisted state
  if (!syncState.LastSyncTime) {
    syncState.LastSyncTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  }
  let claimsSince = JSON.parse(await getClaimsSince(syncState.LastSyncTime))
    .data;
  // filter out the claims that we should add to discord
  let claims = [];
  for (let claim of claimsSince) {
    claim.value = JSON.parse(claim.value);
    if (claim.value.Claim && claim.value.Claim.stream) {
      claim.metadata = claim.value.Claim.stream.metadata;
    } else {
      claim.metadata = null;
    }
    if (claim.bid_state !== "Spent" || claim.bid_state !== "Expired") {
      claims.push(claim);
    }
  }
  for (let claim of claims) {
    console.log(claim);
  }
  // send each claim to discord.
  for (let claim of claims) {
    console.log(claim);
    if (claim.metadata) {
      // If its a claim, make a claimEmbed
      let claimEmbed = new Discord.RichEmbed()
        .setAuthor(
          claim.channel
            ? `New claim from ${claim.channel}`
            : "New claim from Anonymous",
          "http://barkpost-assets.s3.amazonaws.com/wp-content/uploads/2013/11/3dDoge.gif",
          `http://open.lbry.io/${
            claim.channel
              ? `${claim.channel}#${claim.channelId}/${claim["name"]}`
              : `${claim["name"]}#${claim["claimId"]}`
          }`
        )
        .setTitle(
          "lbry://" + (claim.channel ? `${claim.channel}/` : "") + claim["name"]
        )
        .setURL(
          `http://open.lbry.io/${
            claim.channel
              ? `${claim.channel}#${claim.channelId}/${claim["name"]}`
              : `${claim["name"]}#${claim["claimId"]}`
          }`
        )
        .setColor(1399626)
        .setFooter(
          `Block ${claim.height} • Claim ID ${
            claim.claimId
          } • Data from Chainquery`
        );
      if (claim.metadata["title"])
        claimEmbed.addField("Title", claim.metadata["title"]);
      if (claim.channel) claimEmbed.addField("Channel", claim.channel);
      if (claim.metadata["description"]) {
        claimEmbed.addField(
          "Description",
          claim.metadata["description"].substring(0, 1020)
        );
      }
      if (claim.metadata["fee"])
        claimEmbed.addField(
          "Fee",
          claim.metadata["fee"].amount + " " + claim.metadata["fee"].currency
        );
      if (claim.metadata["license"] && claim.metadata["license"].length > 2)
        claimEmbed.addField("License", claim.metadata["license"]);
      if (!claim.metadata["nsfw"] && claim.metadata["thumbnail"])
        claimEmbed.setImage(claim.metadata["thumbnail"]);
      if (
        claim.bid_state !== "Controlling" &&
        claim.height < claim.valid_at_height
      ) {
        // Claim have not taken over the old claim, send approx time to event.
        let takeoverTime =
          Date.now() + (claim.valid_at_height - lastBlockHeight) * 161 * 1000; // in theory this should be 150, but in practice its closer to 161
        claimEmbed.addField(
          "Takes effect on approx",
          moment(takeoverTime, "x").format("MMMM Do [at] HH:mm [UTC]") +
            ` • at block height ${claim.valid_at_height}`
        );
      }
      claimEmbed.addField(
        "Claimed for",
        `${Number.parseFloat(claim.outputValue)} LBC`
      );
      discordPost(claimEmbed);
    } else if (claim.name.charAt(0) === "@") {
      // This is a channel claim
      let channelEmbed = new Discord.RichEmbed()
        .setAuthor(
          "New channel claim",
          "http://barkpost-assets.s3.amazonaws.com/wp-content/uploads/2013/11/3dDoge.gif",
          `http://open.lbry.io/${claim["name"]}#${claim["claimId"]}`
        )
        .setTitle(
          "lbry://" + (claim.channel ? claim.channel + "/" : "") + claim["name"]
        )
        .setURL(`http://open.lbry.io/${claim["name"]}#${claim["claimId"]}`)
        .setColor(1399626)
        .setFooter(
          `Block ${claim.height} • Claim ID ${
            claim.claimId
          } • Data from Chainquery`
        )
        .addField("Channel Name", claim["name"]);
      discordPost(channelEmbed);
    }
  }
  // set the last sync time to the db.
  syncState.LastSyncTime = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  await saveJSON(path.join(appRoot.path, "syncState.json"), syncState);
}

function getJSON(path) {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(path, function(err, jsoncontent) {
      if (err) {
        reject(err);
      } else {
        resolve(jsoncontent);
      }
    });
  });
}
function saveJSON(path, obj) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(path, obj, function(err, jsoncontent) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function discordPost(embed) {
  channels.forEach(channel => {
    discordBot.channels
      .get(channel)
      .send("", embed)
      .catch(console.error);
  });
}

function getClaimsSince(time) {
  return new Promise((resolve, reject) => {
    let query =
      `` +
      `SELECT ` +
      `c.name,` +
      `c.valid_at_height,` +
      `c.height,` +
      `p.name as channel,` +
      `c.publisher_id as channelId,` +
      `c.bid_state,` +
      `c.effective_amount,` +
      `c.claim_id as claimId,` +
      `c.value_as_json as value, ` +
      `c.transaction_hash_id, ` + // txhash and vout needed to leverage old format for comparison.
      `c.vout, ` +
      `o.value as outputValue ` +
      `FROM claim c ` +
      `LEFT JOIN claim p on p.claim_id = c.publisher_id ` +
      `LEFT JOIN output o on (o.transaction_hash=c.transaction_hash_id and o.vout=c.vout) ` +
      `WHERE c.created_at >='` +
      time +
      `'`;
    // Outputs full query to console for copy/paste into chainquery (debugging)
    // console.log(query);
    rp(`https://chainquery.lbry.io/api/sql?query=` + query)
      .then(function(htmlString) {
        resolve(htmlString);
      })
      .catch(function(err) {
        console.log("error", "[Importer] Error getting updated claims. " + err);
        reject(err);
      });
  });
}
