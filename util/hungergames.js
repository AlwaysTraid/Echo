const { Client, Collection, DiscordAPIError, Message, MessageEmbed } = require('discord.js');
const moment = require('moment');
const guild = require('../models/guild');


async function determineEntries(message){

    const startEmbed = new MessageEmbed()
    .setTitle(`**LET THE CHOOSING CEREMONY BEGIN!**`)
    .setDescription(`
    React with ⚔️ to enter!
    `)
    const msg = await message.channel.send(startEmbed)
    msg.react('⚔️')
    const filter = (reaction, user) => ['⚔️'].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id
    try{
        var react = await msg.awaitReactions(filter, {max: 10, time: 10000, errors: ['time']})
        var reaction = react
    }
    catch(e){
        message.channel.send(`10 participants did not react within the time limit so random participants were chosen.`)
    }
    const { reactions } = msg
    reaction = reactions.cache.get('⚔️')
    await reaction.users.fetch()
    var participants = reaction.users.cache.filter(user => !user.bot).array()
    var maxPeople = true
    const guildArray = message.guild.members.cache.array()
    console.log(guildArray)
    while ((participants.length < 10) && (maxPeople)){
        const filteredArray = guildArray.filter(x => !participants.some(p => p.id === x.id) && !x.user.bot)
        if(filteredArray.length <= 0){
            maxPeople = false
        }
        else{
            const selectedUser = filteredArray[Math.floor(Math.random() * filteredArray.length)]
            participants.push(selectedUser)
        }
    }
    startEmbed.setDescription(`\n`)
    var num = 1;
    participants.map((p) => {
        //console.log(p)
        startEmbed.setDescription(`
        ${startEmbed.description}
        ${num}. <@${p.id}>
        `)
        num++
    })
    msg.edit(startEmbed)
    return participants
}

module.exports = {
    determineEntries,
}