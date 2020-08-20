/**
 * returns info on planets and other bodies in the solar system
 */
const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'sls',
    description: 'Provides information on different astronomical bodies in the solar system',
    aliases: ['solarsystem', 'system'],
    usage: ['bodyName'],
    async execute(message, args) {

        if (!args.length) {
            return message.channel.send('Please include the name of the object (or objects) you want to learn about');
        }

        const body = args[0].toLowerCase();
        const result = await fetch(`https://api.le-systeme-solaire.net/rest/bodies/${body}`).catch(error => console.log(error));
        const resultJson = await result.json().catch(error => {
            console.log(error);
            return message.channel.send(`Error '${body}' is not a recognised object`);
        });
        console.log(resultJson);
        return message.channel.send(getBodyInfo(resultJson));

    },
};

function getBodyInfo(result) {

    const planetEmbed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle(result.englishName)
        .addField('Mass: ', `${result.mass.massValue}x10^nkg`, false)
        .addField('Mean Radius: ', `${result.meanRadius}km`, false)
        .addField('Gravity:', `${result.gravity}ms-2`);

    if (result.isPlanet) {
        if (result.moons.length) {
            planetEmbed.addField('Moons: ', result.moons.length, false);
        } else {
            planetEmbed.addField('Moons: 0', false);
        }

    }

    if(result.discoveredBy != '' && result.discoveredDate != '') {
        planetEmbed.addField('Discovered By: ', result.discoveredBy, false);
        planetEmbed.addField('Discovered On: ', result.discoveryDate, true);
    }

    planetEmbed.setFooter('Results provided by Solar system Open API');
    return planetEmbed;
}