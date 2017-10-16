# Bot for [LBRY's Slack](https://slack.lbry.io)

Features:
- price bot to display current price of lbc
- Tipbot for LBC. Responds to `!tip`.
- Posts mining info to #mining every few hours and anytime someone says `!hash`.
- claimbot to view claims on the network
- posts published content to lbry in #content channel

## Requirements

- node
- npm > 0.12.x


## Installation

Create a bot here: https://api.slack.com/apps?new_app=1

after the bot is made head over here to get the token: https://api.slack.com/custom-integrations/legacy-tokens

Then run:

```
npm install
SLACK_TOKEN=<your-slack-token> CHANNEL=<channel-for-bot> node bot.js
```
