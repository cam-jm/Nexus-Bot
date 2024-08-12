const { Message } = require('discord.js');
const fs = require('fs');
const path = require('path');
const root = require('../../');
module.exports = {
    name: 'reload',
    description: 'reload a command',
    args: 0,
    cooldown: 5,
    guildOnly: false,
    essential: true,
    execute(message, args, client) {
        if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        /*try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }*/

        let modules = fs.readdirSync('./commands').filter(file => fs.statSync(path.join('./commands', file)).isDirectory());

        for (let module of modules) {

            // Creates an array with all command file directory in the /commands/<Folder>/ directory.
            let commandFiles = fs.readdirSync(path.resolve(`./commands/${module}`)).
                filter(file => !fs.statSync(path.resolve('./commands/', module, file)).isDirectory()).
                filter(file => file.endsWith('.js'));

            // Loop through each array element (the array contains the command files).
            commandFiles.forEach((f, i) => {
                try {
                    const command = require(`${root}/commands/${module}/${f}`);
                    if (command.name == args[0]) {
                        client.commands.set(command.name, command);
                        message.channel.send("It worked! 🤩");
                    }
                } catch (err) {
                    ls()
                    log(`Error reloading command: ${module}/${f}`, 'warn')
                    log(err, 'warn')
                    ls()
                }
            });
        }

    },
};
