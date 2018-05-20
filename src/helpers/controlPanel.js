import Discord from "discord.js";
import express from "express";
import session from "express-session";
import passport from "passport";
import DiscordStrat from "passport-discord";
import config from "config";

const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;
// Setup passport for discord usage
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});
const scopes = ["identify", "guilds"];
passport.use(
    new DiscordStrat(
        {
            clientID: config.get("Web.clientID"),
            clientSecret: config.get("Web.clientSecret"),
            callbackURL: "http://localhost:3000/callback",
            scope: scopes
        },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
        }
    )
);
// Function to check authentication status
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send("not logged in :(");
}
// Returns all the guilds a user can control
function canControlGuilds(guilds) {
    return guilds.filter(g => {
        gp = new Discord.Permissions(null, g.permissions);
        return gp.has("MANAGE_GUILD");
    });
}
// Lets get some sessions going!
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Standard routes
app.get("/login", passport.authenticate("discord", { scope: scopes }), (req, res) => {});
app.get(
    "/callback",
    passport.authenticate("discord", { failureRedirect: "/me" }),
    (req, res) => {
        res.redirect("/me");
    } // auth success
);
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});
app.get("/me", checkAuth, (req, res) => {
    res.json(req.user);
});

// Time to run?!
module.exports = async function run(client) {
    app.listen(port, host);
    console.log(`Webserver listening on ${host}:${port}`); // eslint-disable-line no-console
};
