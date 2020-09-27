const { MessageEmbed, Message } = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('../models/guild')

module.exports = async (client, guild) => {
   
    guild = new Guild({

        _id: mongoose.Types.ObjectId(),
        guildID: guild.id,
        prefix: {
            type: String,
            default: "-"
        },
        fun: true,
        miscellaneous: true,
        moderation: false,
        botdetails: true,
        music: true,
        entertainment: false

    })

    guild.save()
    .then(result => console.log(result))
    .catch(err => console.error(err))

    const embed = new MessageEmbed()
    .setTitle(`Well! Your life is going to be a whole lot better with Echo! 🥳`)
    .setDescription(`
    》 **Prefix:** \`-\`
    》 **Enable/Disable:** Enable different categories by doing either \`-enable\` or \`-disable\`!
    》 **Invite Me:** Check out the \`-botinfo\` command!
    》 **Prefix:** You are able to change my prefix for this server easily with \`-prefix\`!
    》 **What else?**: Check out \`-help\`!
    》 Any questions can be taken with my creator: \`Traid#8181\`
    `)
    const channel = guild.channels.cache.find(
        (channel) => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES')
    );
    try{
        channel.send(embed)
    }
    catch(e){
        console.log(e)
    }
    console.log('I have joined a new server!')
}