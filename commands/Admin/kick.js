module.exports = {
	name: 'kick',
	description: 'Tag a member and kick them (but not really).',
	aliases: '',
	args: 0,
	cooldown: 5,
	guildOnly: true,
	essential: true,
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}

		const taggedUser = message.mentions.users.first();

		message.channel.send(`You wanted to kick: ${taggedUser.username}`);
	},
};
