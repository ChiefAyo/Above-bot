const fetch = require('node-fetch');
const Discord = require('discord.js');
const { execute } = require('../NASA/apod');
require('dotenv').config();

module.exports = {
    name: 'sfn',
    description: 'Gets latest space flight news',
    aliases: ['sf', 'spaceflight', 'spaceflightnews'],
    usage: ['', 'search term', 'latest'],
    async execute(message, args) {

        // default command output, either user gvies no parameter or 'latest', returns the 5 most recent articles
        if (!args.length || args[0].toLowerCase === 'latest') {

            const result = await fetch(`https://spaceflightnewsapi.net/api/v1/articles?limit=5`).catch(error => {
                console.log(error);
                message.channel.send(`unable to find any articles \n Error: ${error}`);
            });
            const resultJson = await result.json();
            console.log(resultJson);
            message.channel.send(articleList(resultJson));
            return;

        }

        const choice = args[0].toLowerCase();

        // searches for articles matching the search term, returns top 10
        if(choice === 'search') {
            const term = args[1].toLowerCase();

            const result = await fetch(`https://spaceflightnewsapi.net/api/v1/articles?limit=10&search=${term}`).catch(error => {
                console.log(error);
                message.channel.send(`unable to find any articles \n Error: ${error}`);
            });
            const resultJson = await result.json();
            return message.channel.send(articleList(resultJson));
        }


    },
};

/**
 * Creates list of articles as an embed to be sent to the Discord channel
 * @param {json} result object containing information about the releveant articles
 */
function articleList(result) {
    const articleEmbed = new Discord.MessageEmbed().setTitle('Space flight news articles').setColor('#349eeb');

    let i = 0;

    result.docs.forEach(article => {
        i++;
        articleEmbed.addField(`${i}.`, `[${article.title}](${article.url})`, false);
    });

    articleEmbed.setFooter('Articles provided by Space Flight News API');

    return articleEmbed;
}