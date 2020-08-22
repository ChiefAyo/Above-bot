const Discord = require('discord.js');
require('dotenv').config();
const NASA_KEY = process.env.NASA_API_KEY;

module.exports = {
    name: 'earth',
    description: 'Gets a random image of the earth from space, or from a \n specific latitude and longitude',
    aliases: ['earthimage', 'ea'],
    usage: [' ', 'random', 'lat lon'],
    async execute(message, args) {

        if (!args.length || args[0].toLowerCase() === 'random') {
            const latitude = '';
            const longitude = '';

        }
    },
};