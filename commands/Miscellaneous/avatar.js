const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    description: 'Displays the avatar of the mentioned user or of the author',
    category: '💡 Miscellaneous',
    categorydetail: `miscellaneous`,
    usage: `<Mention/ID>`,
    execute(message, args)  {

        const mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!mentionedUser){

            var selfEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`
            
            **User**: ${message.author.username} 
            
            `)

            message.channel.send(selfEmbed)
        
        }
        else{ 
            var userEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(mentionedUser.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`
            
            **User**: ${mentionedUser.user.username}
            
            `)

            message.channel.send(userEmbed)
        }


    }


}