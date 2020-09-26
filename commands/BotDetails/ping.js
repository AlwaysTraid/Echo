const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: 'ping',
    description: 'Checks the bot\'s latency',
    category: '🛠️ BotDetails',
    categorydetail: `botdetails`,
    execute(message, args, client)  {
        message.channel.send(`🏓 Pinging....`).then((msg) => {
            const embed = new MessageEmbed()
                .setTitle("Pong!")
                .setDescription(
                    `🏓 Pong!\nLatency is ${Math.floor(
                    msg.createdTimestamp - message.createdTimestamp
                    )}ms\nAPI Latency is ${Math.round(client.ws.ping)}ms`
                )
                .setColor("RANDOM");
            msg.edit(embed);
            msg.edit("\u200B");
        })
    }
}