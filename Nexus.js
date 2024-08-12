console.log('_nexus');
const logger = require('./helpers/log')
//load node modules
log('Node Modules', 'load');
const fs = require('fs');
const Discord = require('discord.js');
const path = require('path');

//Load configs
log('configs', 'load');
const configs = require('./configs/main.json');
log('private configs','load');
const private = require('./configs/private.json');

//Create client
log('client', 'create')
const client = new Discord.Client();
log('commands collection', 'create')
client.commands = new Discord.Collection();

//Load commands
let modules = fs.readdirSync('./commands/').filter(file => fs.statSync(path.join('./commands/', file)).isDirectory());

for (let module of modules) {
	let commandFiles = fs.readdirSync(path.resolve(`./commands/${module}`)).
		filter(file => !fs.statSync(path.resolve('./commands/', module, file)).isDirectory()).
		filter(file => file.endsWith('.js'));

	commandFiles.forEach((file, index) => {
		try {
			const command = require(`./commands/${module}/${file}`);
			client.commands.set(command.name, command);
		} catch (err) {
			log(`Error loading command: ${module}/${file}`, 'error')
			console.log(err);
		}
	});
}

const cooldowns = new Discord.Collection();

//Ready the bot
client.once('ready', () => {
	log('All system go for launch!', 'ready');
});

//On message
client.on('message', message => {
	try {
		//Has prefix
		if (!message.content.startsWith(configs.prefix) || message.author.bot) return;

		//split command
		const args = message.content.slice(configs.prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		//check it is an acntual command
		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		//Write that down! write that down!
		log(` 😷 ${message.author.id} → 💬 ${message.id} = ${message.content}`, 'command')

		if (command.guildOnly && message.channel.type !== 'text') {
			return message.reply("This commmand isn't supported in DMs.");
		}

		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${configs.prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
		}

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		//Finally time to run the command, and catch any meltdowns it threw (emotional or otherwise)
		try {
			command.execute(message, args, client);
		} catch (err) {
			log(err, 'error');
			message.reply('you caused the command to have a breakdown. Great job!');
		}

		//Catch errors thrown by message event, log, then enable 'safe' mode.
	} catch (err) {
		message.channel.send('The bot almost crashed because of that...');
		log(err, 'error')
	}
});

client.login(private.token);
