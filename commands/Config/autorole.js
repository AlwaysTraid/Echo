const { MessageEmbed } = require('discord.js');
const Config = require('../../models/Config');

module.exports = {
    name: 'autorole',
    description: 'Sets up a role to be automaticaly given to a new member.',
    category: '⚙️ Config',
    categorydetail: `config`,
    usage: `<role ID/name>`,
    async execute(message, args)  {
        
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            return message.channel.send('You do not have permission to use this command! You need the MANAGE_GUILD permission.').then(m => m.delete({timeout: 10000}));
        }
        if(!args){
            return message.channel.send('Please give a valid role ID or name.')
        }
        const ConfigDoc = await Config.findOne({ guildId: message.guild.id })

        if(args[0] == 'off'){
            ConfigDoc.autorole = ""
            ConfigDoc.save()
            const offEmbed = new MessageEmbed()
            .setTitle(`Autorole Disabled!`)
            .setDescription(`The autorole has been disabled from this server.`)
            return message.channel.send(offEmbed)
        }
        try{
            const role = message.guild.roles.cache.find(role => role.name === args.join(" ")) || message.guild.roles.cache.get(args[0]) || message.mentions.roles.first()
            ConfigDoc.autorole = role.id
            await ConfigDoc.save()
            const roleEmbed = new MessageEmbed()
            .setTitle(`Autorole Set!`)
            .setDescription(`The autorole was set to ${role}!`)
            return message.channel.send(roleEmbed)
        }catch(err){
            console.log(err)
            return message.channel.send('Please give a valid role ID or name.')
        }


    }
}