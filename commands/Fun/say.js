const { Client, Collection, DiscordAPIError, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Make the bot say whatever you want!',
    category: '🎱 Fun',
    categorydetail: `fun`,
    usage: '<optional: Channel> <message>',
    async execute(message, args)  {
        
        try {
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('You need the ADMINISTRATOR permission to use this this command').then(m => m.delete({timeout: 10000}));
            message.delete()
            try{
                await message.channel.send(`${args.join(' ')}`)
            }
            catch{}
        } catch (error) {
            console.log(error)
        }

    }
}