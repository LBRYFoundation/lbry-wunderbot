let request = require('request');
let wget = require('wget');
let config = require('config');
let hasSpeechBotChannels = require('../helpers.js').hasSpeechBotChannels;
let inPrivate = require('../helpers.js').inPrivate;
let ChannelID = config.get('speechbot').mainchannel;
//debug output "true/false" outputs same error as slack message in console if set to true
//if set to false console will be left blank like normal
//some have more info on file details of error
let FullDebug = 'true';
//outputs response from speech, very bulk reply
let ResponseDebug = 'false';

exports.commands = [
  'speech' // command that is in this file, every command needs it own export as shown below
];

exports.speech = {
  usage: '<name>',
  description: 'gets top claim from spee.ch, coming soon post to spee.ch',
  process: function(bot, msg, suffix) {
    if (!hasSpeechBotChannels(msg) && !inPrivate(msg)) {
      msg.channel.send('Please use <#' + ChannelID + '> or DMs to talk to speech bot.');
      return;
    }

    let command = '!speech';
    words = suffix
      .trim()
      .split(' ')
      .filter(function(n) {
        return n !== '';
      });
    let imagename = words[0];

    //check if image name is help, if it is then do help message
    if (imagename == 'help') {
      doHelp(bot, msg, suffix);
      return;
    } else {
      //check if imagename is defined if not do error
      if (imagename === undefined) {
        if (FullDebug === 'true') {
          let message = '`no name provided`';
          console.log('no name provided');
          msg.channel.send(message);
          doHelp(bot, msg, suffix);
          return;
        } else {
          let message = '`no name provided`';
          msg.channel.send(message);
          doHelp(bot, msg, suffix);
          return;
        }
      }

      //set second word to url
      let filepath = words[1];

      //check if a url is provided if none do help message
      if (filepath === undefined) {
        if (FullDebug === 'true') {
          let message = '`no url provided, fetching image from:`\n' + 'https://spee.ch/' + imagename;
          console.log('no url provided');
          msg.channel.send(message);
          return;
        } else {
          let message = '`no url provided, fetching image from:`\n' + 'https://spee.ch/' + imagename;
          msg.channel.send(message);
          return;
        }
      }

      //prepare url for other uses
      //we will just set filepath to url to be safe
      let url = filepath;
      //parse first 4 letters of url should be http
      let linkvalid = url.slice(0, 4);

      //check of url provided begins with http in not throw error and help message
      if (linkvalid !== 'http') {
        if (FullDebug === 'true') {
          let message = '`error not a valid url, please start with http or https`';
          console.log('invalid url provided: ' + filepath);
          msg.channel.send(message);
          return;
        } else {
          let message = '`error not a valid url, please start with http or https`';
          msg.channel.send(message);
          return;
        }
      }

      //function to check if url is an image
      let isUriImage = function(uri) {
        //make sure we remove any nasty GET params
        uri = uri.split('?')[0];
        //moving on, split the uri into parts that had dots before them
        let parts = uri.split('.');
        //get the last part ( should be the extension )
        let extension = parts[parts.length - 1];
        //define some image types to test against
        let imageTypes = ['jpg', 'jpeg', 'tiff', 'png', 'gif', 'bmp'];
        //check if the extension matches anything in the list. if it does set true if not set false
        return imageTypes.indexOf(extension) !== -1;
      };

      //check if url is an image if its not throw error and help message
      if (isUriImage(url) === false) {
        if (FullDebug === 'true') {
          let message = '`error not a valid image url, be sure the link includes a file type`';
          console.log('invalid url provided: ' + url);
          msg.channel.send(message);
          return;
        } else {
          let message = '`error not a valid image url, be sure the link includes a file type`';
          msg.channel.send(message);
          return;
        }
      }
      //set third word to nsfw, with it being an optional functionality
      let eighteen = words[2];

      //check is NSFW if yes or no sets proper value if none
      if (eighteen === '' || eighteen === 'none' || eighteen === undefined || eighteen === null || eighteen === 'no' || eighteen === 'false' || eighteen === false || eighteen === 'n') {
        eighteen = 'no';
      } else {
        eighteen = 'yes';
      }

      //prepare url for wget
      //parse the filename to use to save file
      filepath = url.split('/').pop();
      //set proper directory for downloading image
      let outputFile = 'speech-uploads/' + filepath;
      //set download directory to current working directory
      let dir = process.cwd();
      //set full path to directory for speech uploading
      let fullpath = dir + '\\speech-uploads\\' + filepath;

      //download url via wget
      let download = wget.download(url, outputFile);
      //check if url is reachable if not throw error
      download.on('error', function(err) {
        if (FullDebug === 'true') {
          console.log('error could not reach: ' + url + ' : ' + err);
          let message = '`error url could not be reached`';
          msg.channel.send(message);
        } else {
          let message = '`error url could not be reached`';
          msg.channel.send(message);
        }
      });

      download.on('end', output => {
        //if no errors and file ready -> do the request
        output && doSteps(bot, imagename, url, eighteen);
      });
    }

    //send help message
    function doHelp(bot, msg, suffix) {
      msg.channel.send({
        embed: {
          title: '',
          description:
            '**!speech `<Name>`** : *displays top claim on speech* \n\n\n' +
            '**COMING SOON POSTING TO SPEECH** \n\n' +
            '**!speech `<Name> <URL> <NSFW>`** : *Uploads Image URL to Spee.ch* \n' +
            '**NOTE : dont include spaces in name (NSFW is optional true/false, if left blank will default to false)** \n' +
            'EXAMPLE : `!speech my-image-name https://url/to/image.png false`',
          color: 7976557,
          author: {
            name: 'Speech Bot Help',
            icon_url: 'https://spee.ch/2/pinkylbryheart.png'
          }
        }
      });
    }

    //send post request to speech
    function doSteps(bot, imagename, url, eighteen) {
      request.post(
        //url to send post request
        'https://spee.ch/api/publish',
        //json payload
        {
          json: {
            name: imagename,
            file: fullpath,
            nsfw: eighteen
          }
        },
        //get response from server
        function(error, response, body) {
          //output response if ResponseDebug set to true
          if (ResponseDebug === 'true') {
            console.log(response);
            console.log(error);
            console.log(body.success);
            console.log(body.message);
          }

          //check speech response for file path error, if found throw internal error!
          if (body.message === 'no files found in request') {
            if (FullDebug === 'true') {
              console.log('no file found: ' + fullpath);
              let message = '`Failed to upload file internally!!`\n please contact <@244245498746241025> or another moderator if the issue persists';
              msg.channel.send(message);
              return;
            } else {
              let message = '`Failed to upload file internally!!`\n please contact <@244245498746241025> or another moderator if the issue persists';
              msg.channel.send(message);
              return;
            }
          }

          //check speech response for filename error, if found throw internal error!
          if (body.message === 'no name field found in request') {
            if (FullDebug === 'true') {
              console.log('no name field found: ' + imagename);
              let message = '`Failed to upload file internally!!`\n please contact <@244245498746241025> or another moderator if the issue persists';
              msg.channel.send(message);
              return;
            } else {
              let message = '`Failed to upload file internally!!`\n please contact <@244245498746241025> or another moderator if the issue persists';
              msg.channel.send(message);
              return;
            }
          }

          //if no errors post this message
          let message = 'uploading... \n "name":"' + imagename + '",\n "URL": "' + url + '",\n "nsfw":"' + eighteen + '"\n to spee.ch';
          console.log('uploading... \n "name":"' + imagename + '",\n "file name": "' + filepath + '",\n "url":"' + url + '"\n "path":"' + fullpath + '"\n "nsfw": "' + eighteen + '"');
          msg.channel.send(message);
        }
      );
    }
  }
};
