module.exports = {
	name: 'exit',
	description: 'Exit with code 0',
	args: 0,
	cooldown: 5,
	guildOnly: false,
	essential: true,
	execute(message) {
        message.channel.send('Exiting...');
        process.exit(0);
	},
};
