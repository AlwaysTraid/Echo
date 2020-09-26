const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');
const urban = require('relevant-urban');

module.exports = {
    name: 'urban',
    description: 'Urban Search a word!',
    category: '🔥 Entertainment',
    categorydetail: `entertainment`,
    usage: '<term>',
    async execute(message, args)  {

        if (!args[0]) return message.channel.send("Please let me know what you'd like to search with Urban!")
        

        const search = args.slice(0).join(" ")
        try{
            let result = await urban(search).catch(e => {

                return message.channek.send(`I was able to search the query, \`${args[0]}\`, please try again.`)

            })

            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(result.word)
            .setURL(result.urbanURL)
            .setDescription(`
            **Definition:** \n${result.definition}
            **Example:** \n${result.example}
            `)
            .addField("Rating", `👍 ${result.thumbsUp.toLocaleString()} || 👎 ${result.thumbsDown.toLocaleString()}`)
            
            if (result.tags.length > 0 && result.tags.join (" ").length < 1024){

                embed.addField("Tags", result.tags.join(", "), true)

            }
            return message.channel.send(embed)
        }
        catch(e){
            message.channel.send('Search failed. Result not found in urban dictionairy.')
        }


    }
}