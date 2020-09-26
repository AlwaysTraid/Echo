const { MessageEmbed, Message } = require('discord.js');

module.exports = async(oldMessage, newMessage) =>{
    try{
        let embed = new MessageEmbed()
        .setTitle('**Message Edited**')
        .setColor('YELLOW')
        .setDescription(`**The user ${oldMessage.author.tag} has edited a message in <#${oldMessage.channel.id}>**`)
        .addField(`Previous Message`, oldMessage.content, true)
        .addField(`Edited Message`, newMessage.content, true)
        let channel = oldMessage.guild.channels.cache.find(ch => ch.name === "bot-logs")
        if (!channel) return
        channel.send(embed)
    }
    catch(e){}

}