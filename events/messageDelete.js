const { MessageEmbed, Message } = require('discord.js');

module.exports = async(message) =>{
    try{
        if(message.author.bot) return;
        const snipes = message.client.snipes.get(message.channel.id) || [];
        snipes.unshift({
            content: message.content,
            author: message.author,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
            date: new Date().toLocaleString("en-GB", { dataStyle: "full", timeStyle: "short"})
        })
        snipes.splice(10)
        message.client.snipes.set(message.channel.id, snipes)

        let embed = new MessageEmbed()
        .setTitle(`**Message Deleted**`)
        .setColor('RED')
        .setDescription(`**The user ${message.author.tag} had a message deleted in <#${message.channel.id}>**`)
        .addField(`Content`, message.content, true)
        let channel = message.guild.channels.cache.find(ch => ch.name === "bot-logs")
        if (!channel) return
        channel.send(embed)
    }
    catch(e){}

}