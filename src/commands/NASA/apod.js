const fetch = require('node-fetch');
const Discord = require('discord.js');
require('dotenv').config();
const NASA_KEY = process.env.NASA_API_KEY;

module.exports = {
    name: 'apod',
    description: 'Retrieves the current NASA astronomy picture of the day for the current day \n or a chosen day',
    aliases: ['pod'],
    usage: [' ', 'date (YYYY-MM-DD)'],
    async execute(message, args) {

        if (!args.length) {
            // const cacheAvailable = 'caches' in self;
            console.log('reached here');
            // error cause by node-fetch, eslint doesn't like it?
            const result = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`);
            const resultJson = await result.json().catch(error => console.log(error));
            console.log(resultJson);
            // console.log(resultJson.media_type);

            return message.channel.send(embed(resultJson));
        }

        // regex to check the date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        // /^\d{2}([-])\d{2}\1\d{4}$/;

        if(dateRegex.test(args[0])) {

            const chosenDateString = args[0];
            const chosenDate = new Date(chosenDateString);
            // date of first apod
            // const startDateString = "1995-06-16";
            const startDate = new Date("1995-06-16");

            const current = new Date();
            const today = new Date(current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate());

            if(chosenDate > today || chosenDate < startDate) {
                return message.channel.send('Please select a date which is after 16th June 1995, and not after today!');
            }

            // const sD = startDateString.split('-');
            // const start = new Date(sD[0], parseInt(sD[1]))

            const dateString = chosenDate.getFullYear() + '-' + (chosenDate.getMonth() + 1) + '-' + chosenDate.getDate();
            const result = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&date=${dateString}`).catch(error => console.log(error));
            const resultJson = await result.json().catch(error => console.log(error));
            console.log(resultJson);
            console.log(resultJson.media_type);

            return message.channel.send(embed(resultJson));
        } else{
            return message.channel.send('Invalid date format, use "ab.help apod" for more info');
        }

        // return message.channel.send('Invalid input to apod command');
    },
};

/**
 * Sets up the Message embed for apod
 * @param {json} result json containing image or video and info about it
 */
function embed(result) {

    if (result.media_type === 'image') {

        const apodEmbed = new Discord.MessageEmbed()
            .setColor('#000000')
            .setTitle(`Astronomony Picture of the Day: ${result.title}`)
            .setURL(result.hdurl)
            .setImage(result.hdurl)
            .setDescription(result.explanation)
            .setFooter(`Copyright: ${result.copyright} • ${result.date}`);

        return apodEmbed;

    } else if (result.media_type === 'video') {

        // const video;

        const apodEmbed = new Discord.MessageEmbed()
            .setColor('#000000')
            .setTitle(`Astronomony Picture of the Day: ${result.title}`)
            .setURL(result.url)
            .setDescription(result.explanation)
            .setFooter(`Copyright: ${result.copyright} • ${result.date}`);

        return apodEmbed;
    }

    return;
}