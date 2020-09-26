const ms = require('ms')
const { Client, Collection, DiscordAPIError, Message } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Config = require('../../models/Config');

module.exports = {
    name: 'mute',
    description: 'Mutes a member',
    category: '🛡️ Moderation',
    categorydetail: `moderation`,
    usage: `<mention or ID> <time> <reason>`,
    async execute(message, args, client, prefix) {

    //return message.channel.send("The mute command is a current work in progress. Stay tuned!").then(m => m.delete({timeout: 10000}));
        const reason = args.slice(2).join(" ")
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!message.member.hasPermission('KICK_MEMBERS')){

            message.delete()
            return message.author.send("You don\'t have permission to mute members. You need the KICK_MEMBERS permission. If you feel like this is a mistake, contact an administrator.")

        }
        if (!message.guild.me.hasPermission('MANAGE_ROLES')){

            return message.channel.send("I don\'t have permission to mute members. I need the MANAGE_ROLES permission. If you feel like this is a mistake, contact an administrator.")
        }
        if(!mentionedMember) return message.channel.send('Please provide a member you would like to be muted.')

        let role = message.guild.roles.cache.find(role => role.name === "Muted");

        if (!role) return message.channel.send("I couldn't find the 'Muted' role in your server. Please add one if there isn't.")

        let time = args[1];
        if (!time) {
            return message.channel.reply("You didnt specify a time!");
        }
        try{
        var embed = new MessageEmbed()
            .setAuthor(`${message.author.username} - (${message.author.id})`, message.author.displayAvatarURL())
            .setThumbnail(mentionedMember.user.displayAvatarURL())
            .setColor('#e898cd')
            .setDescription(`
            **Member:** ${mentionedMember.user.username} - (${mentionedMember.user.id})
            **Action:** Mute
            **Reason:** ${reason || "Undefined"}
            **Duration:** ${ms(ms(time))}
            **Channel:** ${message.channel}
            **Time:** ${moment().format('llll')}
            `)

            var messageEmbed = new MessageEmbed()
            .setAuthor(`${message.guild.name}`)
            .setThumbnail(message.guild.iconURL())
            .setColor('#e898cd')
            .setDescription(`
            **Member:** ${mentionedMember.user.username} - (${mentionedMember.user.id})
            **Action:** Muted
            **Reason:** ${reason || "Undefined"}
            **Duration:** ${ms(ms(time))}
            **Time:** ${moment().format('llll')}
            `)
            mentionedMember.send(messageEmbed)
            message.channel.send(embed)
            mentionedMember.roles.add(role.id);
        }catch(e){
            message.channel.send(`Make sure you are typing the format by doing \`${prefix}mute <Mentioned/ID> <time> <reason>\`!`)
        }
        const ConfigDoc = await Config.findOne({ guildId: message.guild.id })
            if(ConfigDoc.modlogs){
                try{
                    var channelId = ConfigDoc.modlogsId
                    var channel = message.guild.channels.cache.get(channelId)
                    channel.send(embed)
                }catch(e){}
            }

        setTimeout( function () {
            mentionedMember.roles.remove(role.id);
        }, ms(time));

    }
}