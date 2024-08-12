const prefix = require('../../configs/main.json').prefix;
const discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const root = '../../'

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	args: 0,
	cooldown: 5,
	guildOnly: false,
	essential: true,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {

			const listEmbed = new discord.MessageEmbed()
			listEmbed.setTitle('Commands')
			listEmbed.setDescription("Here's a list of commands for you")

			let modules = fs.readdirSync(`${root}commands/`).filter(file => fs.statSync(path.join(`${root}commands/`, file)).isDirectory());

			for (let module of modules) {

				// Creates an array with all command file directory in the /commands/<Folder>/ directory.
				let commandFiles = fs.readdirSync(path.resolve(`${root}commands/${module}`)).
					filter(file => !fs.statSync(path.resolve(`${root}commands/`, module, file)).isDirectory()).
					filter(file => file.endsWith('.js'));
				var moduleList = '```'
				// Loop through each array element (the array contains the command files).
				commandFiles.forEach((f, i) => {
					try {
						const command = require(`${root}commands/${module}/${f}`);
						//client.commands.set(command.name, command);
						moduleList = `${moduleList} ${command.name}`
					} catch (err) {
						ls()
						log(`Error loading command: ${module}/${f}`, 'warn')
						log(err, 'warn')
						ls()
					}
				});
				moduleList = moduleList + '```'
				listEmbed.addField(module, moduleList,true)
			}
			message.channel.send(listEmbed)
		} else {

			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) {
				return message.reply('that\'s not a valid command!');
			}

			var helpEmbed = new discord.MessageEmbed();
			
			if (command.aliases) {helpEmbed.addField('Aliases',command.aliases.join(', '))};
			if (command.description) data.push(`**Description:** ${command.description}`);
			if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

			message.channel.send(helpEmbed);
		}
	}
};
