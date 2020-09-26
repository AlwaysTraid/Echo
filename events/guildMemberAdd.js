const { MessageEmbed, Message } = require('discord.js');
const Config = require(`../models/Config`)

module.exports = async(member) =>{
    const welcomes = [
        `Boom! You looking for ${member}?`,
        `Oh would you look it that! ${member} finally decided t join us.`,
        `That can't be... ${member} woke up from their nap?`,
        `Well look who finally got time to join us.. ${member}.`,
        `Enjoy your stay ${member}.`,
        `${member} has arrived!`,
        `Welcome to the server ${member}!`,
        `Hullo ${member}!`,
        `Howdy ${member}!`,
        `Wow! Is that the real ${member}?`,
        `Welcome our newest member, ${member}!`,
        `Took you long enough to join the fun ${member}!`,
        `Would you look at the time... it's ${member} o' clock!`,
        `Hmmm... We could always squeeze one more. Welcome ${member}!`,
        `Oh you were joining today? Better late than never ${member}!`,
        `${member} joined to have some fun!`,
        `${member} sensed a party and decided to join!`,
        `About time ${member}!`,
        `Look who the cat dragged in... ${member} finally made it!`,
    ]
    const welcome = welcomes[Math.floor(Math.random() * welcomes.length)]
        
    const ConfigDoc = await Config.findOne({ guildId: member.guild.id })
    if(ConfigDoc.welcome){
        const embed = new MessageEmbed()
        .setAuthor(`${member.user.tag} - ${member.id}`, member.user.displayAvatarURL({ dynamic: true }))
        .setColor('GREEN')
        .setDescription(`${welcome}`)
        .setFooter(`User Join • ${member.guild.memberCount} `)
        .setTimestamp()

            var channelId = ConfigDoc.welcomeId
            var channel = member.guild.channels.cache.get(channelId)
            if(!channel){
                channelId = member.guild.systemChannelID
                channel = member.guild.channels.cache.get(member.guild.systemChannelID)
            }
            channel.send(embed)
    }
    if(member.guild.roles.cache.get(ConfigDoc.autorole) != null){
        try{
            member.roles.add(ConfigDoc.autorole)
        }catch{}
    }
    
}