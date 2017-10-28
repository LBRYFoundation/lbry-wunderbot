# Bot for [LBRY's Discord](https://discord.gg/tgnNHf5)
(This README will be updated along with bot updates)

## Features:

- Tipbot for LBC. Responds to `!tip`.       
- Price bot displays price of lbc for currency given. Responds to `!price <cur> <amount>` 
- Stats bot display current market stats of lbc Responds to `!stats`
- Hash bot displays current hashrate of network Responds to `!hash`
- Github Release Notes bot displays release notes for current lbry-app release. Responds to `!releasenotes`
- Purge Bot (moderator only) deletes X amount of messages. Responds to `!purge <X>`
- Speech bot displays top claim from provided image name(coming soon posting to speech).

     Responds to `!speech <imagename>`
        
- Welcome bot sends Direct Message for new users
- Dynamic plugin loading with permission support.



## Requirements

- node > 8.0.0
- npm > 0.12.x


## Installation

Create a bot and get the bot's API Token: https://discordapp.com/developers/applications/me

Edit and rename default.json.example in /config, then cd to wunderbot directory and run:

```
npm install
node bot/bot.js
```
