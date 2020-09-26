const { Client, Collection, DiscordAPIError } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Config = require('../../models/Config');

module.exports = {
   name: 'kick',
   description: 'Kicks a member from the guild',
   category: '🛡️ Moderation',
   categorydetail: `moderation`,
   usage: `<mention or ID> <reason>`,
   async execute(message, args, client) {
          const reason = args.slice(1).join(" ")
          const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
          
          if (!message.member.hasPermission('KICK_MEMBERS')){

               message.delete()
               return message.author.send("You don\'t have permission to kick members. You need the KICK_MEMBERS permission. If you feel like this is a mistake, contact an administrator.")

          }
          if (!message.guild.me.hasPermission('KICK_MEMBERS')){

               return message.channel.send("I don\'t have permission to kick members. I need the KICK_MEMBERS permission. If you feel like this is a mistake, contact an administrator.")
          }
          if (!args[0]) return message.channel.send("You need to specify someone to kick.")
          if (!mentionedMember) return message.channel.send("I can\'t find that member you mentioned.")
          if (mentionedMember.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id){
               return message.channel.send("You can\'t kick this member due to your role being lower than theirs or they're the guild owner.")
          }
          if (mentionedMember.id === message.author.id) return message.channel.send("Trying to kick yourself? How unfortunate. Can't let you do that. :(")
          if (mentionedMember.kickable){

          var embed = new MessageEmbed()
          .setAuthor(`${message.author.username} - (${message.author.id})`, message.author.displayAvatarURL())
          .setThumbnail(mentionedMember.user.displayAvatarURL())
          .setColor('#e898cd')
          .setDescription(`
          **Member:** ${mentionedMember.user.username} - (${mentionedMember.user.id})
          **Action:** Kick
          **Reason:** ${reason || "Undefined"}
          **Channel:** ${message.channel}
          **Time:** ${moment().format('llll')}
          `)

          var messageEmbed = new MessageEmbed()
          .setAuthor(`${message.guild.name}`)
          .setThumbnail(message.guild.iconURL())
          .setColor('#e898cd')
          .setDescription(`
          **Member:** ${mentionedMember.user.username} - (${mentionedMember.user.id})
          **Action:** Kicked
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

          
          mentionedMember.kick()

          
     } else{
          return message.channel.send("I can\'t kick this user. Make sure I have permissions!!")
     }
     return undefined

}

}