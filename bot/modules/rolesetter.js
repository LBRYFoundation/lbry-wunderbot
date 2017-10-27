
var config = require('config');
rolelist = config.get('rolelist');

exports.commands = [
	"addrole", // command that is in this file, every command needs it own export as shown below
	"delrole",
	"roles"
]

exports.addrole = {
	usage: "<role to add>",
	description: 'description of command',
	process: function(bot,msg,suffix){
        // Here the bot,msg and suffix is avaible, this function can be async if needed.
        //amsg.reply(rolelist.allowedroles.includes(suffix));
        var newrole = msg.guild.roles.find('name', suffix);
        //var rolecheck = msg.guild.roles;
        //var rolecheckvar = JSON.parse(rolecheck).find('name', suffix);

        //console.log('Addrole Event firing.');
        //console.log(rolelist);
        //console.log(rolelist.allowedroles);
        //console.log(config.get('allowedroles'));
        if (rolelist.allowedroles.includes(suffix)) {
            //console.log('Role is in allowed roles.');
            //console.log('Role to add: ' + newrole);
            if (!msg.member.roles.find('name', suffix)) {
                msg.member.addRole(newrole)
                    .then(msg.channel.send(msg.member + ' has been added to the ' + suffix + ' role!'));
                //console.log('Added role')
                //msg.channel.send(msg.member + ' has been added to the ' + suffix + ' role!');
            }
            else{
            msg.channel.send('It seems that you already have that role! Try removing it first with the delrole command!');
            }
        }
        else {
            msg.channel.send("That role isn't one you can add yourself too! Please run the roles command to find out which ones are allowed.");
        }


    }
};
exports.delrole = {
    usage: "<role to remove>",
    description: 'description of command',
    process: function(bot,msg,suffix) {
        // Here the bot,msg and suffix is avaible, this function can be async if needed.
        let oldrole = msg.guild.roles.find('name', suffix);
        //console.log(oldrole);
        //console.log('Delrole Event firing.');
        //console.log(msg);
        //console.log('Printing Suffix! ' + suffix);
        if (rolelist.allowedroles.includes(suffix)) {
            if (msg.member.roles.find('name', suffix)) {
                msg.member.removeRole(oldrole)
                    .then(msg.channel.send(msg.member + ' has been removed from the ' + suffix + ' role!'));
            }
            else {
                msg.channel.send("You don't seem to have that role! Try adding it first with the addrole command!");
            }
        }
        else {
            msg.channel.send("That role isn't one you can add yourself too! Please run the roles command to find out which ones are allowed.");
        }

    }
};
exports.roles = {
    usage: "",
    description: 'description of command',
    process: function(bot,msg,suffix){
        // Here the bot,msg and suffix is avaible, this function can be async if needed.
        msg.channel.send({embed: {
            color: 3447003,
            title: "Wunderbot",
            description: "You have accessed the rolebot function of Wunderbot!",
            fields: [{
                name: "List of roles",
                value: buildRoleString(rolelist.allowedroles),
                inline: false
            }],
            footer:{
                icon_url: msg.author.avatarURL,
                text: 'Requested by: ' + JSON.stringify(msg.author.username)
            }

        }});
    //msg.channel.send(JSON.stringify(rolelist.allowedroles));
    }
};

function buildRoleString(roles) {
    let str = "";
    for (let i = 0; i < roles.length; i++) {
        str += "`" + roles[i] + "`" + '\n';
    }
    return str;
}
