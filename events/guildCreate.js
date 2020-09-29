const { MessageEmbed, Message } = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('../models/guild')

module.exports = async (client, guild) => {
    
    const guildDoc = new Guild({

        _id: mongoose.Types.ObjectId(),
        guildID: guild.id,
        prefix: "-",
        fun: true,
        miscellaneous: true,
        moderation: false,
        botdetails: true,
        music: true,
        entertainment: false

    })

    guildDoc.save()
    .then(result => console.log(result))
    .catch(err => console.error(err))

    let channelID
        let channels = guild.channels.cache
        channelLoop:
        for (let c of channels) {
          let channelType = c[1].type
          if (channelType === "text") {
              channelID = c[0]
              break channelLoop
            }
        }  
        let channel = client.channels.cache.get(guild.systemChannelID || channelID)
  
        channel.send(new MessageEmbed()
        .setTitle(`Well! Your life is going to be a whole lot better with Echo! 🥳`)
        .setColor(`GREEN`)
        .setDescription(`
        》 **Prefix:** \`-\`
        》 **Enable/Disable:** Enable different categories by doing either \`-enable\` or \`-disable\`!
        》 **Invite Me:** Check out the \`-botinfo\` command!
        》 **Prefix:** You are able to change my prefix for this server easily with \`-prefix\`!
        》 **What else?**: Check out \`-help\`!
        》 Any questions can be taken with my creator: \`Traid#8181\`
        `)
        
        )
    console.log('I have joined a new server!')
}