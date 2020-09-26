const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: 'prefix',
    aliases: ['pre'],
    description: 'Sets the prefix for this server.',
    category: '🛠️ BotDetails',
    categorydetail: `botdetails`,
    usage: '<new prefix>',
    async execute(message, args, client, prefix)  {

        var GuildDoc = await Guild.findOne({ guildID: message.guild.id })

        if (!GuildDoc) {
            const newGuildDoc = new Guild({    
                guildID: message.guild.id,
                prefix: args[0] || "-",
                fun: true,
                miscellaneous: true,
                moderation: false,
                botdetails: true,
                music: true,
                entertainment: false,
                giveaway: false,
                config: true,
            })

            newGuildDoc.save()
            GuildDoc = await Guild.findOne({ guildID: message.guild.id })
        }

        if(!args[0]){
            return message.channel.send(`Echo\'s prefix for this server is ${GuildDoc.prefix}`)
        }

        if (!message.member.hasPermission('MANAGE_GUILD')) {
            return message.channel.send('You do not have permission to use this command! You need the MANAGE_GUILD permission.').then(m => m.delete({timeout: 10000}));
        }
        try{
            prefix = args[0]
            GuildDoc.prefix = prefix
            await GuildDoc.save()
            prefix = GuildDoc.prefix
            client.prefix = prefix;

            return message.channel.send(`Your server prefix has been updated to \`${args[0]}\``);
        }
        catch(e){}
    }
}