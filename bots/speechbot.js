var request = require('request');
var wget = require('wget');
var fs = require('fs')

//debug output "true/false" outputs same error as slack message in console if set to true
//if set to false console will be left blank like normal
//some have more info on file details of error
var FullDebug = "false"
//outputs response from speech, very bulk reply
var ResponseDebug = "false"

var slackbot;
var speechChannel;
// !speech {name} {path/url} {NSFW=T/F}
var command = '!speech';

module.exports={
  command: command,
  init: init,
  respond: respond
};

//start the bot
function init(channel_) {
  speechChannel = channel_;
  //check if channel is speech
  if (!channel_) {
    console.log('No speech channel. Speechbot will only respond to #bot-sandbox and DMs.');
  }
}

var globalSlackParams = {};

//begin the bot
function respond(bot, data) {
  var channel = data.channel,
      words = data.text.trim().split(' ').filter( function(n){return n !== "";} );
	  
  //check if message is a command
  if (words[0] !== command) {
    // if the received message isn't starting with the trigger,
    // or the channel is not the speech channel, nor sandbox, nor a DM -> ignore
    return;
  }
  
  //set first word to image name
  var imagename = words[1];
  
  //check if image name is help, if it is then do help message
  if (imagename == "help") {
	   doHelp(bot, channel)
	   return;
  } else {
	  
  //set second word to url
  var filepath = words[2];
  
  //check if a url is provided if none do help message
  if (filepath === undefined) {
	  if (FullDebug === "true") {
	  var message = "`error no url provided`"
	  console.log('no url provided');
	  bot.postMessage(channel, message, globalSlackParams);
	  doHelp(bot, channel);
	  return
  } else {
	  var message = "`error no url provided`"
	  bot.postMessage(channel, message, globalSlackParams);
	  doHelp(bot, channel);
	  return
  }}
  
  //prepare url for other uses
  //remove first < from link
  var str = filepath.substring(0, filepath.length-1); 
  //remove last > from link
  var str = str.substring(1); 
  //we will just set str to url to be safe
  var url = str; 
  //parse first 4 letters of url should be http
  var linkvalid = url.slice(0, 4) 
  
  //check of url provided begins with http in not throw error and help message
  if (linkvalid !== "http") {
	  if (FullDebug === "true") {
		 var message = '`error not a valid url, please start with http or https`'
		  console.log('invalid url provided: ' + filepath);
		  	  bot.postMessage(channel, message, globalSlackParams);
	          doHelp(bot, channel);
			  return
		  } else {
			  var message = '`error not a valid url, please start with http or https`'
			  bot.postMessage(channel, message, globalSlackParams);
			  doHelp(bot, channel);
			  return;
		  }}
  
  //function to check if url is an image
  var isUriImage = function(uri) {
    //make sure we remove any nasty GET params 
    uri = uri.split('?')[0];
    //moving on, split the uri into parts that had dots before them
    var parts = uri.split('.');
    //get the last part ( should be the extension )
    var extension = parts[parts.length-1];
    //define some image types to test against
    var imageTypes = ['jpg','jpeg','tiff','png','gif','bmp'];
    //check if the extension matches anything in the list. if it does set true if not set false
    if(imageTypes.indexOf(extension) !== -1) {
        return true;   
    } else {
		return false
	}
}

//check if url is an image if its not throw error and help message
if (isUriImage(url) === false) {
	if (FullDebug === "true"){
		var message = '`error not a valid image url, be sure the link includes a file type`'
		  console.log('invalid url provided: ' + url);
		  	  bot.postMessage(channel, message, globalSlackParams);
	          doHelp(bot, channel);
			  return;
	} else {
		var message = '`error not a valid image url, be sure the link includes a file type`'
		  	  bot.postMessage(channel, message, globalSlackParams);
	          doHelp(bot, channel);
			  return;
	}
}

  //prepare url for wget
  var source = url;
  //parse the filename to use to save file
  filepath = source.split('/').pop();
  //set proper directory for downloading image
  var outputFile = 'speech-uploads/' + filepath;
  //set download directory to current working directory
  var dir = process.cwd() ;
  //set full path to directory for speech uploading
  var fullpath = dir + '\\speech-uploads\\' + filepath;

		//download url via wget
        var download = wget.download(url, outputFile);
		//check if url is reachable if not throw error
        download.on('error', function(err) {
			if (FullDebug === "true") {
           console.log("error could not reach: " + url + " : " + err);
		   	var message = '`error url could not be reached`'
		    bot.postMessage(channel, message, globalSlackParams);
			return
			} else {
			var message = '`error url could not be reached`'
		    bot.postMessage(channel, message, globalSlackParams);
			return
			}
           });
 
  //set third word to nsfw, with it being an optional functionality
  var eighteen = words[3];

  //check is NSFW if yes or no sets proper value if none
  if (eighteen == "" || eighteen == "none" || eighteen == undefined || eighteen == null || eighteen == "no"|| eighteen == "false" || eighteen == false || eighteen == "n") {
	 eighteen = "no"; 
  } else {
	  eighteen = "yes"
  }

//if no error yet do the request
  doSteps(bot, channel, imagename, url, eighteen)}

//send help message
function doHelp(bot, channel) {
  var message =
    '`' + command + ' <Name> <URL> <NSFW>`: Uploads Image URL to Spee.ch \n' +
    'include all three parameters above: Name of image, URL to Image, NSFW optional put true/false, if left blank will defualt to `false` \n';
  bot.postMessage(channel, message, globalSlackParams);
}

//send post request to speech
function doSteps(bot, channel, imagename, url, eighteen) {
request.post(
     //url to send post request
    'https://spee.ch/api/publish',
	//json payload
    { json: { name: imagename ,file: fullpath,nsfw: eighteen } },
	//get response from server
    function (error, response, body) {
		//output response if ResponseDebug set to true
		if (ResponseDebug === "true") {
        console.log(response);
		console.log(error);
		console.log(body.success);
		console.log(body.message);
		}
		
		//check speech response for file path error, if found throw internal error!
		if (body.message === "no files found in request") {
			if (FullDebug === "true") {
		console.log("no file found: " + fullpath);
		var message = '`Failed to upload file!!`\n this could aslo be an issue with the url no being reachable \n please contact @MSFTserver or another moderator if the issue persists';
		bot.postMessage(channel, message, globalSlackParams);
		return
			} else {
		var message = '`Failed to upload file!!`\n this could aslo be an issue with the url no being reachable \n please contact @MSFTserver or another moderator if the issue persists';
		bot.postMessage(channel, message, globalSlackParams);
		return
			}
		}
		
		//check speech response for filename error, if found throw internal error!
				if (body.message === "no name field found in request") {
			if (FullDebug === "true") {
		console.log("no name field found: " + imagename);
		var message = '`Failed to upload file!!`\n please contact @MSFTserver or another moderator if the issue persists';
		bot.postMessage(channel, message, globalSlackParams);
		return
			} else {
		var message = '`Failed to upload file!!`\n please contact @MSFTserver or another moderator if the issue persists';
		bot.postMessage(channel, message, globalSlackParams);
		return
			}
		}
		
		//if no errors post this message
			var message = 'uploading... \n "name":"' + imagename + '",\n "URL": "' + url + '",\n "nsfw":"' + eighteen + '"\n to spee.ch';
			console.log('uploading... \n "name":"' + imagename + '",\n "file name": "' + filepath + '",\n "url":"' + url + '"\n "path":"' + fullpath + '"\n "nsfw": "' + eighteen + '"' );
			bot.postMessage(channel, message, globalSlackParams);
			



        }
);
};
};
