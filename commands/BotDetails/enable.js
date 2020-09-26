const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: 'enable',
    description: 'Enables categories for use in the server.',
    category: '🛠️ BotDetails',
    categorydetail: `botdetails`,
    usage: '<category>',
    async execute(message, args, client, prefix)  {

        if (!message.member.hasPermission('MANAGE_GUILD')) {
            return message.channel.send('You do not have permission to use this command! You need the MANAGE_GUILD permision.').then(m => m.delete({timeout: 10000}));
        };

        const GuildDoc = await Guild.findOne({ guildID: message.guild.id })

        if (!GuildDoc) {
            const newGuildDoc = new Guild({    
                guildID: message.guild.id,
                prefix: "-",
                fun: true,
                miscellaneous: true,
                moderation: false,
                botdetails: true,
                music: true,
                entertainment: false,
                giveaway: false,
                config: true,
                hungergames: true,
            })

            newGuildDoc.save()
        }
        if (!args[0]) return message.channel.send('Please let me know which category you would like to be enabled.')
        var category = args[0]

        if (category.toLowerCase() == 'botdetails'){
            return message.channel.send(`I'm sorry. BotDetails settings can not be changed.`)
        }
        if (category.toLowerCase() == 'config'){
            return message.channel.send(`I'm sorry. Config settings can not be changed.`)
        }
        if(GuildDoc[category.toLowerCase()] == true){
            return message.channel.send('That category is already `enabled`!')
        }
        else if(GuildDoc[category.toLowerCase()] == false){
            GuildDoc[category.toLowerCase()] = true
            await GuildDoc.save()
            const embed = new MessageEmbed()
            .setTitle('Success!')
            .setAuthor(message.author.username)
            .setColor('GREEN')
            .setDescription(`
            ${category} has been enabled! Remember to check ${prefix}help to see which commands are associated with this category.
            `)
            .setTimestamp()
            return message.channel.send(embed)
        }
        else{
            return message.channel.send(`The category, ${category}, does not exist.`)
        }
    }
}