const { Client, Collection } = require('discord.js');
const { MessageEmbed } = require('discord.js');


module.exports = {
   name: 'stats',
   aliases: ['stat'],
   description: 'Display the stats of the bot.',
   category: '🛠️ BotDetails',
   categorydetail: `botdetails`,
   execute(message, args, client) {

        message.channel.send("``I am in currently in " + client.guilds.cache.size + " servers!``")


   }


}