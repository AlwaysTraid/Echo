const { Client, Collection, DiscordAPIError, Message } = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'coinflip',
    aliases: ['cf'],
    description: 'Flip a coin to randomly get heads or tails.',
    category: '🎱 Fun',
    categorydetail: `fun`,
    execute(message, args)  {

        var sides = ['HEADS!','TAILS!'];

        var selection = sides[Math.floor(Math.random()*sides.length)];

        const embed = new MessageEmbed()
        embed.setTimestamp()
        embed.setColor(`#ee92b1`)
        embed.setThumbnail(`https://i.imgur.com/au2v4On.gif`)
        embed.setFooter(`${message.author.username}`)
        message.channel.send(embed)
        .then((msg)=> {
            setTimeout(function(){
                if(selection === 'HEADS!'){
                    embed.setThumbnail(`https://i.imgur.com/f7HNJnc.png`)
                    embed.setTitle(`
                    You got... Heads!
                    `)
                }
                else if(selection === 'TAILS!'){
                    embed.setThumbnail(`https://i.imgur.com/VjCu2v1.png`)
                    embed.setTitle(`
                    You got... Tails!
                    `)
                }
                msg.edit(embed)
            }, 2600)
        });
    }
}