[![Build Status](https://travis-ci.com/lbryio/lbry-wunderbot.svg?branch=master)](https://travis-ci.com/lbryio/lbry-wunderbot)
## Bot for [LBRY's Discord](https://discord.gg/tgnNHf5)

(This README will be updated along with bot updates)

<h3>
<details><summary>Features:</summary>

* Price bot displays price of lbc for currency given.

  - *Responds to `!price <cur> <amount>`*

* Stats bot displays current market stats of lbc.

  - *Responds to `!stats`*

* Hash bot displays current hashrate of lbc network. Also Includes to calculate given MH/s to LBC & fiat per hr, day, week, month.

  - *Responds to `!hash`*

  - *Responds to `!hash power <MH/s> <fiat>`*

* AltStats bot displays current market stats of specfied currency

  - *Responds to `!altstats <coin>`*

* AltPrice bot displays current price for given coin and currency

  - *Responds to `!altprice <coin> <currency> <amount>`*

* Github Release Notes bot displays release notes for current LBRY Desktop release.

  - *Responds to `!releasenotes`*

  - *(moderator only) `!releasenotes post` - send to release notes channel*

* Purge Bot deletes X amount of messages.

  - *(moderator only)  Responds to `!purge <X>`*

* Speech bot displays top claim from provided image name(coming soon posting to
  speech).

  - *Responds to `!speech <imagename>`*

* Welcome bot sends Direct Message when new users join,

  - *(moderator only) Responds to `!welcome <@username>`*

* Timeout bot assigns members the timeout roll for X-minutes where they are restricted from talking

  - *(moderator only) Responds to `!timeout <@username> <Mins>`*

* Roll Setter bot allows users to assign themselves rolls

  - *Responds to `!addrole <role>` - Adds to Role*

  - *Responds to `!delrole <role>` - Deletes from Role*

  - *Responds to `!roles` - List Available Roles*

* LBRY URL Linker displays lbry:// urls as open.lbry.com links to make them clickable

* LBRY claim bot displays recent publishes on the lbry protocol

* IRC bot to connect an irc channel with discord

* Spam Detection Bot to Prevent Discord Raids and Spammers

* Dynamic plugin loading with permission support.

</details>
</h3>

____

### Requirements

* node > 8.0.0
* npm > 6.4.0
____
### Installation

Create a bot and get the bot's API Token:
https://discordapp.com/developers/applications/me

Edit and rename default.json.example in /config, then cd to wunderbot directory
and run:

```
npm install --production
node bot/bot.js
```
____
### Development

Be sure to run the command below before working on any code, this ensures
prettier goes to work and keeps code to our standard.

```
npm install
```
to run prettier before submitting your code simply run the following in the bots root directory.

```
npm run prettier
```
To be sure your build will pass with TravisCI, also be sure to run
```
npm run test
```
