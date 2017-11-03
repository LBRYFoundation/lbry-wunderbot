/*
// Example #1 Command(use this to make your Commands with triggers like !demo)
	exports.commands = [
		"demo" // command name that will be used for next lines of code below
	]

	exports.demo = {
		usage: "<subcommand>", //command usage like !demo <@username>, exclude !demo
		description: 'description of command', //the description of command for !help command
		process: function(bot,msg,suffix){
		// Here the bot,msg and suffix is available, this function can be async if needed.
	    }
	}

// Example #2 Function(use this to make your Functions that dont need trigger words unlike !demo)
	exports.custom = [
	    "myFunction" //change this to your function name
	]

	exports.myFunction = function(bot) {
	    // Other functions that need to be ran once on bootup!
	    // For example a timed function and or some init stuff..
	}
*/
