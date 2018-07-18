import { Command } from "discord.js-commando";
import { RichEmbed } from "discord.js";

module.exports = class SetModlogsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "releasenotes",
            memberName: "releasenotes",
            group: "lbry",
            aliases: ["rn"],
            description: "Sends the latest releasenotes to the channel.",
            examples: ["releasenotes"],
            guildOnly: true
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission("ADMINISTRATOR");
    }

    async run(msg) {
        try {
            let githubResponse = await this.client.request({
                url: "https://api.github.com/repos/lbryio/lbry-desktop/releases/latest",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Super Agent/0.0.1"
                },
                cacheKey: "https://api.github.com/repos/lbryio/lbry-desktop/releases/latest",
                cacheTTL: 1,
                cacheLimit: 1,
                resolveWithFullResponse: false
            });
            githubResponse = JSON.parse(githubResponse);
            const releaseEmbed = new RichEmbed();
            if (githubResponse.body.length < 2000) {
                releaseEmbed
                    .setTitle(`*Download ${githubResponse.name} here!*`)
                    .addField("Release information", githubResponse.body, true)
                    .setURL(githubResponse.html_url)
                    .setTimestamp(githubResponse.published_at)
                    .setColor(7976557)
                    .setAuthor(`LBRY Desktop release notes for ${githubResponse.name}`, "http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png", githubResponse.html_url);
                return msg.embed(releaseEmbed) && msg.delete();
            }
            const message = githubResponse.body
                .trim()
                .split("###")
                .filter(n => n !== "");
            const releasemessage1 = message[0];
            const releasemessage2 = message[1];
            const releasemessage3 = message[2];
            const releasemessage4 = message[3];
            const releasemessage5 = message[4];

            const message1 = {
                embed: {
                    title: `*Download ${githubResponse.name} here!*`,
                    description: releasemessage1,
                    url: githubResponse.html_url,
                    color: 7976557,
                    timestamp: githubResponse.published_at,
                    author: {
                        name: `LBRY Desktop Release Notes for ${githubResponse.name}`,
                        icon_url: "http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png"
                    },
                    footer: {
                        icon_url: "https://i.imgur.com/yWf5USu.png",
                        text: "LBRY Desktop Updated "
                    }
                }
            };
            const message2 = {
                embed: {
                    description: releasemessage2,
                    color: 7976557,
                    timestamp: githubResponse.published_at,
                    author: {
                        icon_url: "http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png"
                    },
                    footer: {
                        icon_url: "https://i.imgur.com/yWf5USu.png",
                        text: "LBRY Desktop Updated "
                    }
                }
            };
            const message3 = {
                embed: {
                    description: releasemessage3,
                    color: 7976557,
                    timestamp: githubResponse.published_at,
                    author: {
                        icon_url: "http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png"
                    },
                    footer: {
                        icon_url: "https://i.imgur.com/yWf5USu.png",
                        text: "LBRY Desktop Updated "
                    }
                }
            };
            const message4 = {
                embed: {
                    description: releasemessage4,
                    color: 7976557,
                    timestamp: githubResponse.published_at,
                    author: {
                        icon_url: "http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png"
                    },
                    footer: {
                        icon_url: "https://i.imgur.com/yWf5USu.png",
                        text: "LBRY Desktop Updated "
                    }
                }
            };
            const message5 = {
                embed: {
                    description: releasemessage5,
                    color: 7976557,
                    timestamp: githubResponse.published_at,
                    author: {
                        icon_url: "http://www.pngall.com/wp-content/uploads/2016/04/Github-PNG-Image.png"
                    },
                    footer: {
                        icon_url: "https://i.imgur.com/yWf5USu.png",
                        text: "LBRY Desktop Updated "
                    }
                }
            };
            msg.channel.send(message1);
            msg.channel.send(message2);
            msg.channel.send(message3);
            msg.channel.send(message4);
            msg.channel.send(message5);
            msg.delete();
        } catch (e) {
            console.log(e);
            return msg.reply("Could not get the latest releasenotes from github API.");
        }
    }
};
