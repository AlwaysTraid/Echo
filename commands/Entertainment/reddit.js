const { Client, Collection, DiscordAPIError, Message } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    name: 'reddit',
    description: 'Choose a subreddit to get a meme from',
    category: '🔥 Entertainment',
    categorydetail: `entertainment`,
    usage: '<subreddit>',
    async execute(message, args, client) {

            let subreddit = args[0]

            if(args[0].slice(0, 2) === 'r/'){
                return message.channel.send('Please type the subreddit without the `r/`!')  
            }
            if(!subreddit) return message.channel.send('Please specify a subreddit you\'d like to search a meme for!')

            try{
                const img = await fetch(`https://imgur.com/r/${subreddit}/hot.json`)
                .then(response => response.json())
                .then(body => body.data)
                const selected = img[Math.floor(Math.random() * img.length)]
                const embed = new MessageEmbed()
                .setTitle(`Meme from r/${subreddit}`)
                .setURL(`https://reddit.com/r/${subreddit}`)
                .setColor('RANDOM')

                message.channel.send(embed)
                message.channel.send(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`)
            }catch(err){
                return message.channel.send('The subreddit was either NSFW, locked or does not exist. Please search an available subreddit.')
            }


    }
}