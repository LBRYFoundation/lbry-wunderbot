import commando from "discord.js-commando";
import path from "path";
import config from "config";
import { oneLine } from "common-tags";
import { MongoClient } from "mongodb";
import MongoDBProvider from "commando-provider-mongo";
import requestCacheSupport from "request-promise-cache";
import checkCustomCommands from "./helpers/customCommands";
import controlPanel from "./helpers/controlPanel";

module.exports = class Wunderbot extends commando.Client {
    constructor() {
        super({
            owner: config.get("Wunderbot.owner"),
            commandPrefix: config.get("Wunderbot.defaultPrefix")
        });
        // Add our own version of request with cache support :)
        this.request = requestCacheSupport;
        // ADD our custom commands helper :)
        this.on("message", msg => {
            checkCustomCommands(msg, this);
        });
        this.on("error", console.error)
            .on("warn", console.warn)
            // .on("debug", console.log)
            .on("ready", () => {
                console.log(`##      ## ##     ## ##    ## ########  ######## ########  ########   #######  ########
##  ##  ## ##     ## ###   ## ##     ## ##       ##     ## ##     ## ##     ##    ##
##  ##  ## ##     ## ####  ## ##     ## ##       ##     ## ##     ## ##     ##    ##
##  ##  ## ##     ## ## ## ## ##     ## ######   ########  ########  ##     ##    ##
##  ##  ## ##     ## ##  #### ##     ## ##       ##   ##   ##     ## ##     ##    ##
##  ##  ## ##     ## ##   ### ##     ## ##       ##    ##  ##     ## ##     ##    ##
 ###  ###   #######  ##    ## ########  ######## ##     ## ########   #######     ##

`);
                console.log(
                    `Client ready; logged in as ${this.user.username}#${this.user.discriminator} (${this.user.id})`
                );
            })
            .on("disconnect", () => {
                console.warn("Disconnected!");
            })
            .on("reconnecting", () => {
                console.warn("Reconnecting...");
            })
            .on("commandError", (cmd, err) => {
                if (err instanceof commando.FriendlyError) return;
                console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
            })
            .on("commandBlocked", (msg, reason) => {
                console.log(oneLine`
                Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ""}
                blocked; ${reason}
            `);
            })
            .on("commandPrefixChange", (guild, prefix) => {
                console.log(oneLine`
                Prefix ${prefix === "" ? "removed" : `changed to ${prefix || "the default"}`}
                ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
            `);
            })
            .on("commandStatusChange", (guild, command, enabled) => {
                console.log(oneLine`
                Command ${command.groupID}:${command.memberName}
                ${enabled ? "enabled" : "disabled"}
                ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
            `);
            })
            .on("groupStatusChange", (guild, group, enabled) => {
                console.log(oneLine`
                Group ${group.id}
                ${enabled ? "enabled" : "disabled"}
                ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
            `);
            });

        this.setProvider(
            MongoClient.connect(config.get("Wunderbot.dbUrl"), { useNewUrlParser: true }).then(
                client => new MongoDBProvider(client.db(config.get("Wunderbot.dbName")))
            )
        ).catch(console.error);
        this.registry
            .registerDefaults()
            .registerTypesIn(path.join(__dirname, "types"))
            .registerCommandsIn(path.join(__dirname, "commands"));
        // .registerGroup("util", "Utility");
        this.login(config.get("Wunderbot.token"));
        controlPanel(this); // Lets start the control panel!
    }
};
