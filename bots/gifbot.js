var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var path = require('path');
var fs = require('fs');

var slackbot;
var imgur;

var cache = {};
var cache_timeout = 3600; // 1h
var output_dir = path.resolve(path.dirname(require.main.filename), 'files');

//function will check if a directory exists, and create it if it doesn't
function checkDirectory(directory, callback) {
  fs.stat(directory, function(err, stats) {
    //Check if error defined and the error code is "not exists"
    if (err && err.errno === 34) {
      //Create the directory, call the callback.
      fs.mkdir(directory, callback);
    } else {
      //just in case there was a different error:
      callback(err)
    }
  });
}

module.exports = {
  init: init,
  handle_msg: handle_msg
};

function init(_slackbot, imgur_client_id)
{
  if (!imgur_client_id)
  {
    console.log('No imgur client id, disabling gifbot');
    return;
  }

    slackbot = _slackbot;
    imgur = require('imgur');
    imgur.setClientId(imgur_client_id);
}

function jsonrpc_call(method, params, callback) {
  var xhr = new XMLHttpRequest;
  xhr.addEventListener('load', function() {
    var response = JSON.parse(xhr.responseText);
    callback(response);
  });

  xhr.addEventListener('error', function (e) {
      callback({error: e})
  });

  xhr.open('POST', 'http://localhost:5279/lbryapi', true);
  payload = {
    'jsonrpc': '2.0',
    'method': method,
    'params': [params],
    'id': 0
  };
  console.log('JSONRPC', payload);
  xhr.send(JSON.stringify(payload));
}

function handle_msg(msg, channel)
{
    if (!imgur)
    {
        return;
    }

    var words = msg.trim().split(' ');

    words.forEach(function(word)
    {
        if (word.lastIndexOf('<lbry://', 0) === 0)
        {
            word = word.slice(8, -1); // strip <lbry:// and >
            handle_url(word, channel);
        }
    });
}

function check_url(url, callback)
{
    jsonrpc_call('resolve_name', {'name': url}, function(response)
    {
        if (response.error)
        {
            callback(response.error);
            return;
        }

        var resolved = response.result;
        if (!resolved)
        {
            callback(false);
            return;
        }

        if (resolved.fee)
        {
            callback(false);
            return;
        }

        var meta_version = resolved.ver ? resolved.ver : '0.0.1';
        var field_name = (meta_version == '0.0.1' || meta_version == '0.0.2') ? 'content-type' : 'content_type';
        var content_type = resolved[field_name];
        callback(content_type == 'image/gif');
    });
}

function handle_url(url, channel)
{
    console.log('Detected URL', url, 'on channel', channel);

    if (!cache[channel])
    {
        cache[channel] = {};
    }

    var now = new Date().getTime() / 1000;
    if (cache[channel][url])
    {
        var elapsed = now - cache[channel][url];
        if (elapsed < cache_timeout)
        {
            console.log(url, 'is cached for this channel, ignoring...')
            return;
        }
    }


    check_url(url, function(valid)
    {
        if (valid)
        {
            console.log('Fetching', url);
            fetch_url(url, channel);
        }

        else
        {
            console.log('Ignoring', url);
        }
    });
}

function fetch_url(url, channel)
{
    checkDirectory(output_dir, function(error)
    {
        if(error) {
            console.error("Could not create output directory", error);
            slackbot.postMessage(channel, 'Unable to fetch URL [' + url + ']. Output directory missing.');
        } else {
           jsonrpc_call('get', {'name': url, 'download_directory': output_dir}, function(response)
           {
               var result = response.result;
               if (!result)
               {
                   console.warn('Failed to fetch', url);
                   console.warn(response);
                   slackbot.postMessage(channel, 'Unable to fetch URL [' + url + ']. Insufficient funds?');
                   return;
               }

               var filename = result.path;
               console.log('Uploading', filename);
               imgur.uploadFile(filename).then(function(uploaded)
               {
                   var link = uploaded.data.link;
                   console.log(link);
                   var attachments = [{image_url: link, title: url}];
                   slackbot.postMessage(channel, null, {attachments: attachments})
                   cache[channel][url] = new Date().getTime() / 1000;
               }).catch(function(err)
               {
                   console.error(err.message);
               });
           });
        }
    });
}
