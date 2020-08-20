const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'iss',
    description: 'Locates the current postion of the International Space Station',
    aliases: ['spaceStation'],
    usage: [],
    cooldown: 1,
    async execute(message, args) {

        if (!args.length || args[0].toLowerCase === 'where') {
            const result = await fetch(`https://api.wheretheiss.at/v1/satellites/25544`).catch(error => {
                console.log(error);
                return message.channel.send(`Sorry, I'm having trouble locating the ISS now, \n Error: ${error}`);
            });
            const resultJson = await result.json().catch(error => console.log(error));
            console.log(resultJson);
            return message.channel.send(await display(resultJson));
        }
    },
};

/**
 * displays the iss location as a json object
 * @param {json} result the json object containing the location of the ISS
 * ISS
 */
async function display(result) {

    const iSSEmbed = new Discord.MessageEmbed()
        .setTitle('Where is the ISS right now?')
        .setColor('#d1d0cd')
        .addField('Latitude:', result.latitude, false)
        .addField('Longitude:', result.longitude, false);


    const locationCheck = await fetch(`https://api.wheretheiss.at/v1/coordinates/${result.latitude},${result.longitude}`).catch(error => console.log(error));
    const locationJson = await locationCheck.json().catch(error => {
        console.log(error);
        iSSEmbed.addField('Location:', 'Unable to locate country/timezone');
        iSSEmbed.setFooter(`Data provided by 'wheretheiss.at'`);
        return iSSEmbed;
    });

    console.log(locationJson);
    const location = `${locationJson.timezone_id} • ${locationJson.country_code}`;

    iSSEmbed.addField('Location:', location, false);
    iSSEmbed.setFooter(`Data provided by 'wheretheiss.at'`);

    return iSSEmbed;
}