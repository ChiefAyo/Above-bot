const Discord = require('discord.js');
const roles = require('./roles.json');

module.exports = {
    name: 'role',
    description: 'allows a user to assign themself a role based on a chosen planet \n Will override existing roles with the same name, be careful',
    aliases: ['prole', 'planetrole'],
    usage: ['planet name'],
    execute(message, args) {

        // creates roles if this is the first time the command is being used
        // currently its recreating the roles everytime the command is made
        // TODO need to stop roles from being recreated when command used again
        roles.planets.forEach(element => {
            const role = element.name;
            if (!message.member.guild.roles.cache.find(r => r.name === role)) {
                let isAdmin = false;
                if (message.member.hasPermission(['ADMINISTRATOR'])) {
                    isAdmin = true;
                    message.member.guild.roles.create({
                        data: { name: element.name, color: element.colour },
                    });
                } else {
                    return message.channel.send('You must have administrator permission to use this command for the first time');
                }
            }
        });

        if (!args.length) {
            return message.channel.send('Please select a role from one of the planet name (includes pluto)');
        }

        const chosenPlanet = args[0].toLowerCase();

        const chosenRole = message.member.guild.roles.cache.find(role => role.name.toLowerCase() === chosenPlanet);

        // checks if the role exists on the server
        // command is also failing to assing roles to users, :( big sad
        if (chosenRole) {
            const user = message.author;
            let hasRole = false;
            let i = 0;
            while (!hasRole && i < roles.planets.length) {
                if (message.member.roles.cache.find(r => r.name === roles.planets[i].name)) {
                    const oldRole = message.member.guild.roles.cache.find(role => role.name.toLowerCase() === roles.planets[i].name);
                    message.member.roles.remove(oldRole);
                    hasRole = true;
                }
                i++;
            }
                message.member.roles.add(chosenRole);
        }
    },
};