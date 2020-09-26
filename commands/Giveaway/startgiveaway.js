const ms = require('ms')
const { GiveawaysManager } = require("discord-giveaways")
const Giveaway = require('../../models/Giveaway')
const { MessageEmbed } = require('discord.js')
const { saveGiveaway, scheduleGiveaway } = require('../../util/giveaway')
var moment = require("moment");
require('moment-duration-format')

const prompts = [
    `What would you like the title of the giveaway to be? You can type \`cancel\` to stop the setup.`,
    `What is the prize for your giveaway going to be? You can type \`cancel\` to stop the setup.`,
    `How long would you like this giveaway to last? You can type \`cancel\` to stop the setup.`,
    `How many winners do you want for your giveaway? You can type \`cancel\` to stop the setup.`,
    `What would you like to have messaged to the winners after the giveaway is over? You can type \`cancel\` to stop the setup.`,
]
var activeMessage = new Map()

module.exports = {
    name: "startgiveaway",
    aliases: ['sg', 'gstart',],
    description: "Starts a giveaway for your server!",
    category: '🎉 Giveaway',
    categorydetail: 'giveaway',
    usage: "<channel>",
    async execute(message, args, client, prefix){

        if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
            return message.channel.send('You need the MANAGE_MESSAGES permission or a role called Giveaways to start a giveaway.')
        }
        if(activeMessage.get(message.channel.id)){
            return message.channel.send("A giveaway is already being made!")
        }
        var [id] = args
        let channel = message.mentions.channels.first() || client.channels.cache.get(id)
        try{
            id = channel.id
        }
        catch(e){return message.channel.send(`When typing the command, please use \`${prefix}startgiveaway <channel-name>\`. The channel name is mandatory.`)}
        if(channel){
            try{
                activeMessage.set(message.channel.id, true)
                const response = await getResponses(message)
                if (response.title != null){
                    const embed = new MessageEmbed()
                    .addField('Title', response.title, true)
                    .addField('Prize', response.prize, true)
                    .addField('Number of Winners', response.winners, false)
                    .addField('Duration', response.duration, true)
                    .addField('Message', response.gMessage, false)
                    const msg = await message.channel.send('Confirm', embed)
                    await msg.react('👍')
                    await msg.react('👎')

                    const filter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id
                    const reactions = await msg.awaitReactions(filter, {max: 1, time: 30000, errors: ['time']})
                    const choice = reactions.get('👍') || reactions.get('👎')
                    if(choice.emoji.name === '👍'){
                        
                        response.endsOn = new Date(Date.now() + ms(response.duration))
                        const giveawayEmbed = new MessageEmbed()
                        .setTitle(`🎉 ${response.title} 🎉`)
                        .setDescription(`
                            **Prize**: ${response.prize}\n
                            **Number of Winners**: ${response.winners}\n
                            **Ends In**: ${moment.duration(ms(response.duration)).format('d [days] h [hours] m [mins and] s [seconds]')}\n
                            **JOIN the giveaway by REACTING with 🎉 to ENTER!!**
                        `)
                        const giveawayMsg = await channel.send(giveawayEmbed)
                        await giveawayMsg.react('🎉')
                        response.messageId = giveawayMsg.id
                        response.guildId = giveawayMsg.guild.id
                        response.channelId = id;
                        await saveGiveaway(response)
                        await scheduleGiveaway(client, [response], false)
                    }
                    else if (choice.emoji.name === '👎'){
                        message.channel.send('Rejected Giveaway')
                    }
                    activeMessage.delete(message.channel.id)
                }
            }catch (err){
                console.log(err)
            }
        }else{
            return message.channel.send('That channel does not exist')
        }     
    }
}

async function getResponses(message){
    
    const validTime = /^\d+(s|m|h|d)$/
    // 10s(seconds) 10m(minutes) 10h(hours) 10d(days) 
    const validNumber = /\d+/
    const responses = {}

    for (let i = 0; i < prompts.length; i++){
        await message.channel.send(prompts[i])
        const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1})
        const { content } = response.first()
        if(content.toLowerCase() == 'cancel'){
            activeMessage.delete(message.channel.id)
            return message.channel.send('Giveaway Creation Cancelled')
        }
        if (i === 0){
            responses.title = content
        }
        if (i == 1){
            responses.prize = content
        }
        else if (i == 2){
            if (validTime.test(content)){
                responses.duration = content
            }
            else{
                i--
                message.channel.send(`Invalid time format. Try again.`)
            }
        }
        else if (i == 3){
            if (!isNaN(parseInt(content))){
                responses.winners = content
            }
            else{
                i--
                message.channel.send(`Invalid input for ammount of winners. Try again.`)
            }
        }
        else if (i == 4){
            responses.gMessage = content
        }
    }
    return responses
    
}