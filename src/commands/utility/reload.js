const path = require('path');
const glob = require('glob');
const fs = require('fs');

module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    execute(message, args) {
        if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no such command with the name/alias \`${commandName}\`, ${message.author}!`);

        // removes the command from the cache so that it can be required again
        // delete require.cache[require.resolve(__dirname + `/${command.name}.js`)];

        glob.sync(`./commands/**/${command.name}.js`).forEach((file) => {
            delete require.cache[path.resolve(file)];
            console.log('test 1');
        });


        // attemps the actual reloading of the command by requiring ot igain
        try {

            // need to figure out require issue, only thing preventing reload
            glob.sync(`./commands/**/${command.name}.js`).forEach((file) => {
                const newCommand = require(path.resolve(file));
                message.client.commands.set(newCommand.name, newCommand);
                console.log('test 2');
            });
            console.log(message.client.commands);

            // const newCommand = require(`./${command.name}.js`);
            // message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${command.name}\` was reloaded!`);
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error trying to reload the command \`${command.name}\`:\n\`${error.message}\``);
        }
    },
};