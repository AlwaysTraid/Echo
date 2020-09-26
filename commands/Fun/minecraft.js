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

        var mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        var answer = ""
        var sentmessage = ""
        var header;
        var embed;
        console.log(mentionedMember)
        if(!mentionedMember){
            message.channel.send(`Who will you like to send this carepackage to? (Mention or ID)`)
            var filter = (user) => {
                return user.author.id === message.author.id;
            }
            await message.channel
                .awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
                .then((reply) => {
                    var a = reply.first();
                    var b = a.content
                    //console.log('b:' + b.id)
                    mentionedMember = message.guild.members.cache.get(b) || b.mentions.members.first()
                    console.log('Mentioned Member: '+ mentionedMember.id) 
                })
                .catch(() => {
                   return message.channel.send('What took you so long? Try typing the command again to restart.');
                })
            message.channel.send(`Would you like to add a message?`)
            filter = (user) => {
                return user.author.id === message.author.id;
            }
            await message.channel
                .awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
                .then((reply) => {
                    answer = reply.first();
                })
                .catch(() => {
                   return message.channel.send('What took you so long? Try typing the command again to restart.');
                })
            if(answer.content.toLowerCase() == 'yes'){
                message.channel.send(`What would you like to add to your message?`)
                filter = (user) => {
                    return user.author.id === message.author.id;
                }
                await message.channel
                    .awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                    .then((reply) => {
                        sentmessage = reply.first();
                    })
                    .catch(() => {
                       return message.channel.send('What took you so long? Try typing the command again to restart.');
                    })
            }
            //try{
                header = headers[Math.floor(Math.random() * headers.length)]
                embed = new MessageEmbed()
                embed.setTitle(header)
                embed.setColor('RED')
                if(sentmessage.content != ''){
                    embed.setDescription(sentmessage.content)
                }
                embed.setFooter(`Sent by: ${message.author.username} || Server: ${message.guild.name}`)
                await mentionedMember.user.send(embed)
                mentionedMember.user.send(`Credit: iTMG ; https://cdn.discordapp.com/attachments/751169425117282304/752993280320471214/video0.mp4`)
                message.channel.send('Sent!')
            //}
            //catch(e){
               // message.channel.send(`Something went wrong. Make sure you mentioned the member you want this sent to or you gave their ID`)
            //}
            
        }
        else{

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


}