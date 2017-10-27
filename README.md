# Bot for [LBRY's Discord](https://discord.gg/tgnNHf5)
(This README will be updated along with bot updates)
Features:

- Tipbot for LBC. Responds to `!tip`.
- Price bot displays price of lbc for currency given. Responds to `!price <cur> <amount>`
- Github Release Notes bot displays release notes for current lbry-app release. Responds to `!releasenotes`
- Speech bot displays top claim from provided image name(coming soon posting to speech). Responds to `!speech <imagename>`
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
