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
        roles.planets.forEach(element => {
            const role = element.name;
            if (!message.member.guild.roles.cache.has(role)) {
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
        if (message.member.roles.cache.has(chosenRole)) {
            const user = message.author;
            let hasRole = false;
            let i = 0;
            while (!hasRole && i < roles.planets.length) {
                if (user.roles.cache.some(role => role.name === roles.planets[i].name)) {
                    hasRole = true;
                    const oldRole = roles.planets[i].name;
                    user.roles.remove(oldRole);
                }
                i++;
            }
                user.roles.add(chosenRole);
        }
    },
};