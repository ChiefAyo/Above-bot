const Discord = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();
const NASA_KEY = process.env.NASA_API_KEY;

module.exports = {
    name: 'earth',
    description: 'Gets a random image of the earth from space, or from a \n specific latitude and longitude',
    aliases: ['earthimage', 'ea'],
    usage: [' ', 'random', 'lat lon'],
    async execute(message, args) {

        // maximum possible longitude on the earth
        const maxLongitude = 180;
        // maximum possible latitude on the eartn
        const maxLatitide = 85.05112878;

        if (!args.length || args[0].toLowerCase() === 'random') {
            // selects random latitude between 85.05112878 and - 85.05112878
            const latitude = (Math.random() * (Math.floor(maxLatitide) - Math.ceil(-maxLatitide) + 1) + Math.ceil(-maxLatitide));
            console.log(`lat=${latitude}`);
            // selects a random longitude between 180 and -180
            const longitude = (Math.random() * (Math.floor(maxLongitude) - Math.ceil(-maxLongitude) + 1) + Math.ceil(-maxLongitude));
            console.log(`lon=${longitude}`);

            const result = await fetch(`https://api.nasa.gov/planetary/earth/assets?lon=${longitude}&lat=${latitude}&api_key=${NASA_KEY}`);
            const resultJson = await result.json().catch(error => console.log(error));

            console.log(resultJson);
        }
    },
};


/**
 * Creates an embed to display the image of the earth
 * @param {json} result json object containing data returned from earth image request
 */
function showEarth(result) {

    const earthEmbed = new Discord.MessageEmbed()
        .setColor('#218f1f')
        .setTitle('Random Earth Picture');

}