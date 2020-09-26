const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: 'role',
    description: 'Grants/Removes a role from a user',
    category: '🛡️ Moderation',
    categorydetail: `moderation`,
    usage: `<ID> <role-name>, <role-name>, etc.`,
    async execute(message, args, client)  {

        if (!message.member.hasPermission('MANAGE_MESSAGES')){
            return message.channel.send(`You must have the MANAGE_MESSAGES permission to do this command.`).then(m => m.delete({timeout: 10000}));
        }

        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!mentionedMember){
            return message.channel.send(`That member does not exist. Please mention a  member or provide their ID.`)
        }
        args.shift()
        var roleNames = args.forEach(role =>{

            roleNames.add(role)

        })

        for (var i = 0; i < roles.size(); i++){

            const role = message.guild.roles.cache.find((role) => {
                return role.name === roleNames[i]
            })

            if(!role) {
                return message.channel.send(`Role ${roleName[i]} does not exist.`)
            }
    
            if(mentionedMember.guild.roles.cache.get(role.id)){
    
                mentionedMember.guild.roles.remove(role)
    
            }else{
    
                mentionedMember.guild.roles.add(role)
    
            }
    

        }
        
    }
}