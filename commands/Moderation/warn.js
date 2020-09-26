const warns = require('../../models/warns')
const { Client, Collection, DiscordAPIError, Message } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment')
const Guild = require('../../models/guild');
const Config = require('../../models/Config');

module.exports = {
   name: 'warn',
   description: 'Warns a member',
   category: '🛡️ Moderation',
   categorydetail: `moderation`,
   usage: `<mention or ID> <reason>`,
   async execute(message, args, client) {

        let mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!message.member.hasPermission(`MANAGE_MESSAGES`)){
            message.delete()
            return message.author.send("You don\'t have permission to warn members. You need the MANAGE_MEMBERS permission. If you feel like this is a mistake, contact an administrator.")
        }
        if (!mentionedMember) return message.channel.send(`Please mention a user!`)
        if (!args.slice(1).join(" ")) return message.channel.send(`Please specify a reason!`)
        var reason = args.slice(1).join(" ")
        
        var embed = new MessageEmbed()
            .setTitle(`${mentionedMember.user.username} has been warned by ${message.author.username}`)
            .setAuthor(`${message.author.username} - (${message.author.id})`, message.author.displayAvatarURL())
            .setThumbnail(mentionedMember.user.displayAvatarURL())
            .setColor('RED')
            .setDescription(`
            **Member:** ${mentionedMember.user.username} - (${mentionedMember.user.id})
            **Action:** Warned
            **Reason:** ${reason || "Undefined"}
            **Channel:** ${message.channel}
            **Time:** ${moment().format('llll')}
            `)

            var messageEmbed = new MessageEmbed()
            .setTitle(`You have been warned in ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL())
            .setColor('RED')
            .setDescription(`
            **Member:** ${mentionedMember.user.username} - (${mentionedMember.user.id})
            **Reason:** ${reason || "Undefined"}
            **Time:** ${moment().format('llll')}
            `)
            mentionedMember.send(messageEmbed)
            message.channel.send(embed)

            const ConfigDoc = await Config.findOne({ guildId: message.guild.id })
            if(ConfigDoc.modlogs){
                try{
                    var channelId = ConfigDoc.modlogsId
                    var channel = message.guild.channels.cache.get(channelId)
                    channel.send(embed)
                }catch(e){}
            }

   }
}