const { Client, Collection, DiscordAPIError, Message } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    name: 'meme',
    description: 'Get a random meme',
    category: '🔥 Entertainment',
    categorydetail: `entertainment`,
    async execute(message, args, client) {
        try{
            let subreddits = [
                "dankmemes",
            ]
            let subreddit = subreddits[Math.floor(Math.random()*(subreddits.length))]
        
        
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
        }catch(e){
            message.channel.send('The meme which was selected was either deleted or NSFW.')
        }



    }
}