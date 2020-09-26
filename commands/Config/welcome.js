const { MessageEmbed } = require('discord.js');
const Config = require('../../models/Config');

module.exports = {
    name: 'welcome',
    description: 'Enables/Disables welcome messages in the desired channel.',
    category: '⚙️ Config',
    categorydetail: `config`,
    async execute(message, args, client, prefix)  {

        if (!message.member.hasPermission('MANAGE_GUILD')) {
            return message.channel.send('You do not have permission to use this command! You need the MANAGE_GUILD permission.').then(m => m.delete({timeout: 10000}));
        }
        const ConfigDoc = await Config.findOne({ guildId: message.guild.id })
        var onoff = ConfigDoc.welcome
        try{
            if(!args[0]){
                if(onoff){
                    onoff = false
                    message.channel.send(`Welcome messages have been turned off.`)
                }
                else{
                    onoff = true
                    message.channel.send(`Welcome messages have been turned on.`)
                }
            }else{
                if(args[0].toLowerCase() === 'on'){
                    onoff = true
                    message.channel.send(`Welcome messages have been turned on.`)
                }
                else if (args[0].toLowerCase() === 'off'){
                    onoff = false
                    message.channel.send(`Welcome messages have been turned off.`)
                }
                else if (args[0].toLowerCase() === 'channel'){
                    message.channel.send(`What channel would you like to change the welcome messages to?`)
                    const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1})
                    const msg = response.first()
                    const channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.content)
                    if(!channel){
                        return message.channel.send('Please return an actual channel in your server')
                    }
                    else{
                        if(!onoff){
                            return message.channel.send('Please turn welcome messages on first.')
                        }
                        ConfigDoc.welcomeId = channel.id
                        await ConfigDoc.save()
                        return message.channel.send(`The channel was changed to ${client.channels.cache.get(ConfigDoc.welcomeId)}`)
                    }
                }
                else{
                    return message.channel.send('Please input either `on` or `off` or `channel` if you\'d like to change the channel.')
                }
            }
        }catch(e){}

        if(onoff){
            try{
                if(ConfigDoc.welcomeId != ""){
                    return;
                }
                else{
                    message.channel.send(`What channel would you like to change the welcome messages to?`)
                    const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1})
                    const msg = response.first()
                    const channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.content)
                    if(!channel){
                        return message.channel.send('Please return an actual channel in your server')
                    }
                    else{
                        ConfigDoc.welcomeId = channel.id
                        ConfigDoc.welcome = true
                        await ConfigDoc.save()
                        return message.channel.send(`The channel was changed to ${client.channels.cache.get(ConfigDoc.welcomeId)}`)
                    }
                }
            }catch(e){}
        }
        else{
            ConfigDoc.welcome = false
            ConfigDoc.welcomeId = ""
            await ConfigDoc.save()
        }
    }
}