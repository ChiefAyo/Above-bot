const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    description: 'universal help command for all other commands',
    aliases: ['commmands', 'allcommands'],
    usage: ['command name'],
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        // adds help informatiomn to array and shows all possible commands
        if (!args.length) {
            data.push('List of available commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Maybe you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('That is not a command');
        }

        data.push(`**Name:** ${command.name}`);

        // adds aliases, description and usage of the command to the help array
        if (command.aliases) data.push(`**Aliases: ** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description: ** ${command.description}`);
        if (command.usage) data.push(`**Usage: ** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown** ${command.cooldown || 3} second(s)`);

        // splits data if it is over the character limit

        message.channel.send(data, { split: true });
    },
};