const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const moment = require('moment')
const Guild = require('../../models/guild');
require('moment-duration-format')

module.exports = {
    name: 'botinfo',
    aliases: ['info'],
    description: 'Displays information about the bot',
    category: '🛠️ BotDetails',
    categorydetail: `botdetails`,
    async execute(message, args, client, prefix)  {

        const uptime = moment.duration(client.uptime).format('h[ hours], m[ minutes, and ] s[ seconds]')

        const GuildDoc = await Guild.findOne({ guildID: message.guild.id })
        var embed = new MessageEmbed()
            .setAuthor(`${client.user.username} - (${client.user.id})`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor('#e898cd')
            .addField(`》**Echo Invitation**`, `[Invite!](https://discord.com/oauth2/authorize?client_id=741693874413633646&scope=bot&permissions=2146958839)`, true)
            .addField(`》**GitHub Repository Code**`, `[Find Here](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`, true)
            .addField(`》**Servers**`, `Helping ${client.guilds.cache.size} servers (${client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0)} members)`, true)
            .addField(`》**Uptime**`, `${uptime}`, true)
            .addField(`》**Creator**`, `Traid#8181`, true)
            .addField(`》**Library**`, `[discord.js](https://discord.js.org/#/)`, true)

        message.channel.send(embed)





    }
}