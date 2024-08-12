module.exports = {
	name: 'ping',
	description: 'Ping!',
	args: 0,
	cooldown: 5,
	guildOnly: false,
	essential: true,
	execute(message) {
		message.channel.send('Pong.');
	},
};
