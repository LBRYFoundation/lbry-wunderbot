var needle = require('needle');
var slackbot;
var mongo;
var command = '!m';
var apitoken;
module.exports={
  command: command,
  init: init,
  check: check
};

var globalSlackParams = {
  icon_emoji: ':lbr:'
};

function init(mongodburl,apitoken_, slackbot) {
  const MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(mongodburl, function (err, db) {
    if (err) {
      throw err;
    }
    mongo = db;
    
  });
  apitoken = apitoken_
  slackbot.getChannels()
  .then( data => {
      data.channels.forEach(function(ch) {
        mongo.collection('m_topic').findOneAndUpdate(
        { 'channel': ch.id },
        { 'channel': ch.id, 'topic': ch.topic.value },
        { 'upsert': true, 'returnOriginal': false },
        function (err, obj) {
          if(err){
            console.log(err);
          }
        });
      }, this);
    }, err => {
      console.log(err);
    })
  console.log('Loaded moderationbot!');
}


function check(slackbot, data) {
  if(data.text){
      if (data.text.trim().split(' ')[0] === command) {
        //Add commands here later aswell!
      }
  }
  if(data.topic){ // Gets called on topic change in a channel
    slackbot.getUser(data.user_profile.name)
    .then( usr => {
      if(usr.is_admin){
        mongo.collection('m_topic').findOneAndUpdate(
        { 'channel': data.channel },
        { 'channel': data.channel, 'topic': data.topic },
        { 'upsert': true, 'returnOriginal': false },
        function (err, obj) {
          if(err){
            console.log(err);
          }
        });
      }else if(!usr.is_bot){
        mongo.collection('m_topic').findOne({'channel': data.channel}, function(err, document) {
          slackbot.postMessage(data.user,`Hey <@${data.user_profile.name}>, you are not allowed to change the topic in <#${data.channel}>!`, globalSlackParams);
          if(process.env.CHANNEL_LOG){
            slackbot.postMessage(process.env.CHANNEL_LOG,`User <@${data.user_profile.name}> tried to change the topic in <#${data.channel}> to: \`\`\`${data.topic}!\`\`\``, globalSlackParams);
          }
          needle.get(`https://slack.com/api/channels.setTopic?token=${apitoken}&channel=${data.channel}&topic=${document.topic}`);
        });
      }
    }, err => {
      console.log(err);
    })
  }
  if(data.type == 'pin_added'){ // Gets called on a user pin
  needle.get(`https://slack.com/api/users.info?token=${apitoken}&user=${data.user}`, function(err, resp) {
    if(!resp.body.user.is_admin){
      needle.get(`https://slack.com/api/pins.remove?token=${apitoken}&channel=${data.item.channel}&timestamp=${data.item.message.ts}`);
      slackbot.postMessage(data.user,`Hey <@${resp.body.user.name}>, you are not allowed to add pins in <#${data.channel_id}>!`, globalSlackParams);
      if(process.env.CHANNEL_LOG){
          slackbot.postMessage(process.env.CHANNEL_LOG,`User <@${resp.body.user.name}> tried to pin a message in <#${data.channel_id}>!`, globalSlackParams);
      }
    }
  });
  }
  if(data.channel == process.env.CHANNEL_OA && data.type == 'message'){ //If user is trying to post in a admin only channel..
  needle.get(`https://slack.com/api/users.info?token=${apitoken}&user=${data.user}`, function(err, resp) {
    if(!resp.body.user.is_admin){
      console.log(`https://slack.com/api/chat.delete?token=${apitoken}&ts=${data.ts}&channel=${data.channel}`);
      needle.get(`https://slack.com/api/chat.delete?token=${apitoken}&ts=${data.ts}&channel=${data.channel}`);
      if(data.subtype !=='channel_join' && data.subtype !=='channel_leave') {
        slackbot.postMessage(data.user,`Hey <@${resp.body.user.name}>, you are not allowed to post messages in <#${data.channel}>!`, globalSlackParams);
        if(data.subtype !=='channel_join' && data.subtype !=='channel_leave' && process.env.CHANNEL_LOG){
          slackbot.postMessage(process.env.CHANNEL_LOG,`User <@${resp.body.user.name}> tried to post a message in <#${data.channel}>!`, globalSlackParams);
        }
      }
    }   
  });
  }
}

