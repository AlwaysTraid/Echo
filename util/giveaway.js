const ms = require('ms')
const Giveaway = require(`../models/Giveaway`)
const schedule = require('node-schedule');
const { MessageEmbed } = require('discord.js');
const moment = require('moment')
require('moment-duration-format')

async function saveGiveaway(response){
    const{
        title, prize, winners, duration, guildId, messageId, channelId, endsOn, gMessage
    } = response;
    const giveaway = new Giveaway({

        guildId: guildId,
        messageId: messageId,
        channelId: channelId,
        title: title,
        prize: prize,
        winners: winners,
        duration: duration,
        endsOn: endsOn,
        createdOn: new Date(),
        gMessage: gMessage

    })
    return giveaway.save()
}

async function scheduleGiveaway(client, giveaways, reroll){
    for (let i = 0; i < giveaways.length; i++){
        var { channelId, messageId, endsOn, prize, gMessage, winners} = giveaways[i]
        
        if (reroll){
            var GiveawayDoc = await Giveaway.findOne({ messageId: messageId })
            if(GiveawayDoc){
                var newDateObj = moment(Date.now()).add(1, 's').toDate();
                channelId = GiveawayDoc.channelId
                messageId = GiveawayDoc.messageId
                endsOn = newDateObj
                prize = GiveawayDoc.prize
                gMessage = GiveawayDoc.gMessage
                winners = GiveawayDoc.winners
            }
        }
        schedule.scheduleJob(endsOn, async () => {
            const channel = client.channels.cache.get(channelId)
            if (channel){
                const message = await channel.messages.fetch(messageId)
                if (message){
                    const {embeds, reactions } = message
                    const reaction = reactions.cache.get('🎉')
                    const users = await getAllUsers(reaction)
                    const entries = users[0].filter(user => !user.bot).array()
                    if (embeds.length === 1){
                        const embed = embeds[0]
                        let winners = determineWinners(entries, giveaways[i].winners, reroll)
                        embed.setDescription(`
                        ~~${embed.description}~~\n\n
                        **WINNER(S): ${winners}**
                        `)
                        await message.edit(embed)
                        channel.send(`Congrats to ${winners.map(user => user.toString()).join(' ')} for winning **${prize}**`)
                        
                        try{
                            const dmEmbed = new MessageEmbed()
                            .setTitle(`Congratulations!`)
                            .addField(`You have just won a giveaway for **${prize}** from ${message.guild.name}!`, `A message from the host:\n ${gMessage}`)
                            winners.forEach(w => {
                                w.send(dmEmbed)
                            })
                        }catch{}
                    }
                }
            }

        })
    }
}

function determineWinners(users, max, reroll){
    
    if(reroll){
        max = 1
    }
    if (users.length <= max){
        return users;
    }
    const data = []

    for (let i = 0; max > i; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]

        const index = users.indexOf(randomUser)

        if (index === 0) users.shift()
        else users.splice(index, index)
    
        data.push(randomUser)
    }
    return data;
}

async function getAllUsers(reaction){
    let entries = [];
    let users = await reaction.users.fetch();
    entries = entries.concat(users)
    while (users.size === 100){
        const {id} = users.last()
        users = await reaction.users.fetch({ after: id })
        entries = entries.concat(users)
    }
    return entries
}

async function editEmbed(client, channelId, messageId, endsOn, prize, gMessage, winners){
    const channel = client.channels.cache.get(channelId)
        if (channel){
            const message = await channel.messages.fetch(messageId)
            if (message){
                const {embeds} = message
                if (embeds.length === 1){
                    const time = ms(Number(endsOn) - Number(Date.now()))
                    const embed = embeds[0]
                    embed.setDescription(`
                    **Prize**: ${prize}\n
                    **Number of Winners**: ${winners}\n
                    **Ends On**: ${moment.duration(time).format('d [days] h [hours] m [mins and] s [seconds]')}\n
                     **JOIN the giveaway by REACTING with 🎉 to ENTER!!**
                    `)
                }
            }
        }

}

module.exports = {
    saveGiveaway,
    scheduleGiveaway,
    getAllUsers,
    determineWinners,
}