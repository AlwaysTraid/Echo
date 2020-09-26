const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const moment = require('moment')
const Guild = require('../../models/guild');

module.exports = {
    name: 'user',
    aliases: ['whois', 'userinfo', 'ui'],
    description: 'Displays the information of a mentioned member',
    category: '💡 Miscellaneous',
    categorydetail: `miscellaneous`,
    usage: `<Mention/ID>`,
    execute(message, args)  {
        mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member

        if(!mentionedMember){
            mentionedMember = message.author
        }

        if (mentionedMember.presence.status === 'online') mentionedMember.presence.status = 'Online';
        if (mentionedMember.presence.status === 'idle') mentionedMember.presence.status = 'Idle';
        if (mentionedMember.presence.status === 'dnd') mentionedMember.presence.status = 'Do Not Disturb';
        if (mentionedMember.presence.status === 'offline') mentionedMember.presence.status = 'Offline';

        const memberEmbed = new MessageEmbed()
        .setTitle(`${mentionedMember.user.username}#${mentionedMember.user.discriminator}`)
        .setThumbnail(`${mentionedMember.user.displayAvatarURL({ dynamic: true, size: 256})}`)
        .setColor(`RANDOM`)
        .setDescription(`
        **》 Server Status**
        Known as: ${mentionedMember.nickname || mentionedMember.user.username}
        Join Date: ${moment.utc(mentionedMember.joinedAt).format('DD/MM/YY')}
        Roles: ${mentionedMember.roles.cache.array().map(r => r).join(' | ')}

        **》 User Info**
        Name: ${mentionedMember.user.username}#${mentionedMember.user.discriminator}
        ID: ${mentionedMember.id}
        Status: ${mentionedMember.presence.status}
        Account Creation Date: ${moment.utc(mentionedMember.createdAt).format('DD/MM/YY')}
        `)
        .setFooter(`${mentionedMember.id} || `)
        .setTimestamp()
        return message.channel.send(memberEmbed)
        
            
    }

}