# Bot for [LBRY's Slack](https://slack.lbry.io)

Features:

- Tipbot for LBC. Responds to `!tip`.
- Posts mining info to #mining every few hours and anytime someone says `!hash`.


## Requirements

- node
- npm > 0.12.x


## Installation

Create a bot and get the bot's API Token: https://YOURSLACK.slack.com/apps/manage/custom-integrations

Then run:

```
npm install
SLACK_TOKEN=<your-slack-token> CHANNEL=<channel-for-bot> node bot.js
```
