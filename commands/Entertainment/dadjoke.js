const giveMeAJoke = require('discord-jokes');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'dadjoke',
    aliases: ['dj'],
    description: 'Get a random dad joke',
    category: '🔥 Entertainment',
    categorydetail: `entertainment`,
    async execute(message, args) {
    

        giveMeAJoke.getRandomDadJoke (function(joke) {
            var dadJoke = joke;
            const embed = new MessageEmbed()
            .setTitle("Oops... You dropped this")
            .setDescription(dadJoke)
            .setColor("RANDOM")

            message.channel.send(embed)
        });
        
    }
}