
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
        var newrole = msg.guild.roles.find('name', suffix);
        //var rolecheck = msg.guild.roles;
        //var rolecheckvar = JSON.parse(rolecheck).find('name', suffix);

        //console.log('Addrole Event firing.');
        //console.log(rolelist);
        //console.log(rolelist.allowedroles);
        //console.log(config.get('allowedroles'));
        if (suffix === rolelist.allowedroles.Member || rolelist.allowedroles.Trustee) {
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
        var oldrole = msg.guild.roles.find('name', suffix);
        //console.log(oldrole);
        //console.log('Delrole Event firing.');
        //console.log(msg);
        //console.log('Printing Suffix! ' + suffix);
        if (suffix === rolelist.allowedroles.Member || rolelist.allowedroles.Trustee) {
            if (msg.member.roles.find('name', suffix)) {
                msg.member.removeRole(oldrole);
                msg.channel.send(msg.member + ' has been removed from the ' + suffix + ' role!')
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
    msg.channel.send(JSON.stringify(rolelist.listedroles));
    }
};
