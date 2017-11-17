# Bot for [LBRY's Discord](https://discord.gg/tgnNHf5)

(This README will be updated along with bot updates)

## Features:

* Price bot displays price of lbc for currency given. Responds to `!price <cur>
  <amount>`
* Stats bot display current market stats of lbc. Responds to `!stats`
* Hash bot displays current hashrate of network. Responds to `!hash`

  Also Includes `!hash power <MH/s>` to calculate given MH/s to LBC per hr, day,
  week, month.

* Github Release Notes bot displays release notes for current lbry-app release.

  Responds to `!releasenotes`

  (moderator only) `!releasenotes post` to send to specified channel

* Purge Bot (moderator only) deletes X amount of messages. Responds to `!purge
  <X>`
* Speech bot displays top claim from provided image name(coming soon posting to
  speech).

  Responds to `!speech <imagename>`

* Welcome bot sends Direct Message when new users join,

  (moderator only) Responds to `!welcome <@username>`

* Spam Detection Bot to Prevent Discord Raids and Spammers
* Dynamic plugin loading with permission support.

## Requirements

* node > 8.0.0
* npm > 0.12.x
* yarn ( install with npm install -g yarn if not installed )

## Installation

Create a bot and get the bot's API Token:
https://discordapp.com/developers/applications/me

Edit and rename default.json.example in /config, then cd to wunderbot directory
and run:

```
yarn install
node bot/bot.js
```

## Development

Be sure to run the command below before working on any code, this ensures
prettier goes to work and keeps code to our standard.

```
yarn install --production=false
```
