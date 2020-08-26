// node file handling
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// files filtered to only include those which are js files

const commandFolders = fs.readdirSync(__dirname + '/commands/');

for (const folder of commandFolders) {
	const files = fs.readdirSync(__dirname + `/commands/${folder}`).filter(file => file.endsWith('.js'));
	for(const file of files) {
		const command = require(__dirname + `/commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}


const cooldowns = new Discord.Collection();

// sends messag to console once the client is ready
client.once('ready', () => {
	console.log('Ready!');
});

// bot logs in using provided token
client.login(token);

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}


	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	// console.log(command.cooldown);

	if (timestamps.has(message.author.id)) {
		console.log('success');
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} second(s) before using the \`${commandName}\` again!`);

		}

	} else {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		command.execute(message, args);

	} catch (error) {
		console.error(error);
		message.reply('Error trying to execute command');
	}

});
