const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'jshelp',
    aliases: ['js'],
    description: 'A help server for learning Discord.js',
    category: '🛠️ BotDetails',
    categorydetail: `botdetails`,
    async execute(message) {
        message.delete()
        const embed = new MessageEmbed()
        .setTitle(`Need Discord.js Help?`)
        .setAuthor(`Aspect can help you out!`)
        .setColor('#00FFFF')
        .addField('Want to give it a try?', '[Sure](https://discord.gg/BnUBVXa)')
        .setDescription(`
        Aspect's goal is to help young coders get help with their Discord Bots to become the next generation of developers. Will you be the next one?
        `)
        message.author.send(embed)

    }
}