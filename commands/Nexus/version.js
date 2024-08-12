const canvas = require('canvas');
const discord = require('discord.js');
const verNum = require('../../configs/main.json').rel.num
const verName = require('../../configs/main.json').rel.name
const verStab = require('../../configs/main.json').rel.stab
module.exports = {
	name: 'version',
	description: 'View a bunch of meaningly version information.',
	cooldown: 5,
	essential: true,
	execute(message) {
		const verEmbed = new discord.MessageEmbed()
		verEmbed.addFields(
			{ name: verNum, value: `\`\`\`${verName}\`\`\`` }
		)
		message.channel.send(verEmbed);
	},
};