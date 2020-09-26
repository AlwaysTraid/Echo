const ms = require('ms')
const { GiveawaysManager } = require("discord-giveaways")
const Giveaway = require('../../models/Giveaway')
const { MessageEmbed } = require('discord.js')
const { saveGiveaway, scheduleGiveaway, determineWinners, getAllUsers,  } = require('../../util/giveaway')

module.exports = {
    name: "reroll",
    description: "Reroll a finished giveaway",
    category: '🎉 Giveaway',
    categorydetail: 'giveaway',
    usage: "<messageID>",
    async execute(message, args, client){
        if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
            return message.channel.send('You need the MANAGE_MESSAGES permission or a role called Giveaways to reroll a giveaway.')
        }

        if(!args){
            return message.channel.send('You did not give a message ID to execute this command')
        }

        var GiveawayDoc = await Giveaway.findOne({ messageId: args })

        if(!GiveawayDoc){
            return message.channel.send(`I couldn't find that giveaway. Please make sure you are using the correct message ID.`)
        }
        const channel = client.channels.cache.get(GiveawayDoc.channelId)

        if(!channel){
            return message.channel.send('The channel the giveaway was hosted in no longer exists.')
        }
        await scheduleGiveaway(client, [GiveawayDoc], true)
    }
}