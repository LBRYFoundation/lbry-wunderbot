# LBRY Hashbot

Hashbot for [LBRY's Slack](https://slack.lbry.io). Posts mining info to #mining every hour and anytime someone says `!hash`.

## Installation

Requirements:

- node
- npm > 0.12.x

Create a bot and get the bot's API Token: https://YOURSLACK.slack.com/apps/manage/custom-integrations

Replace `<your-slack-token>` below with your api token.

```
npm install
SLACK_TOKEN=<your-slack-token> node bot.js
```

Made by Fillerino for LBRYs slack. MIT Licensed so feel free to improve!