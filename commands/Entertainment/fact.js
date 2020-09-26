const { Client, Collection, DiscordAPIError, Message } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const rf = require('random-facts')

module.exports = {
    name: 'fact',
    aliases: ['rf'],
    description: 'Get a random fact',
    category: '🔥 Entertainment',
    categorydetail: `entertainment`,
    async execute(message, args, client) {

        const factEmbed = new MessageEmbed()
        .setTitle('Random Fact!')
        .setColor('RANDOM')
        .setDescription(`
        ${rf.randomFact()}
        `)
        .setFooter(message.author.username)
        .setTimestamp()

        message.channel.send(factEmbed)

    }
}