const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: 'snipe',
    description: 'Snipe the last thing deleted in the channel',
    category: '🛡️ Moderation',
    categorydetail: `moderation`,
    usage: `<# of snipe>`,
    async execute(message, args, client)  {


        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.channel.send('You do not have permission to use this command! You need the MANAGE_MESSAGES permision.').then(m => m.delete({timeout: 10000}));
        };

        const snipes = client.snipes.get(message.channel.id) || [];
        const msg = snipes[args[0]-1 || 0]
        if (!msg) return message.channel.send(`That snipe does not exist or there is nothing to snipe!`)

        const embed = new MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true, size: 256}))
        .setColor('RED')
        .setDescription(msg.content)
        .setFooter(`Date: ${msg.date} | ${args[0]||1}/${snipes.length}`)
        if(msg.attachment) embed.setImage(msg.attachment)
        message.channel.send(embed)


    }
}