const { Client, Collection, DiscordAPIError, Message } = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'minecraft',
    aliases: ['mc'],
    description: 'Send a special minecraft video to a friend :)',
    category: '🎱 Fun',
    categorydetail: `fun`,
    usage: '<mention/ID> <message>',
    async execute(message, args)  {

        const headers = [
            "Care package has arrived",
            "You just got a letter",
            "Someone has sent you a gift",
            "Is it christmas already?"
        ]
        
        if(!args[0]) return message.channel.send('Please mention the user you would like this sent to.')

        var mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        var sentmessage = ""
        var header;
        
            sentmessage = args.slice(1).join(" ")

            try{
                header = headers[Math.floor(Math.random() * headers.length)]
                var preembed = new MessageEmbed()
                preembed.setTitle(header)
                preembed.setColor('RED')
                if(sentmessage){
                    preembed.setDescription(sentmessage)
                }
                preembed.setFooter(`Sent by: ${message.author.username} || Server: ${message.guild.name}`)
                await mentionedMember.user.send(preembed)
                mentionedMember.user.send(`Credit: iTMG ; https://cdn.discordapp.com/attachments/751169425117282304/752993280320471214/video0.mp4`)
                message.channel.send('Sent!')
            }
            catch(e){
                message.channel.send(`Something went wrong. Make sure you mentioned the member you want this sent to or you gave their ID`)
            }


    }


}