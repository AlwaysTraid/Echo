const { MessageEmbed, Message } = require('discord.js');
const Config = require(`../models/Config`)

module.exports = async(member) =>{
    const exits = [
        `It's sad to see you go ${member}`,
        `${member} just poofed out of existance`,
        `Did ${member} mistake the leave and boost button?`,
        `Well ${member} is gone.`,
        `Enjoy your stay ${member}.`,
        `${member} has left!`,
        `Sorry to see you go ${member}!`,
        `Bye ${member}!`,
        `${member} forgot to say their goodbyes...`,
        `I know ${member} will come back soon...`,
        `Can we get an F in the chat.... ${member} has left.`,
        `${member} has passed...`,
        `Guess ${member} had better things to do...`,
        `Hmm... someone must've spam pinged ${member}!`,
        `Oh well.. ${member} just left the best server in town!`,
        `I dunno why ${member} decided to leave.`,
        `Misclick ${member}?`,
        `R.I.P ${member}.`,
        `Arrivederci ${member}!`,
    ]
    const exit = exits[Math.floor(Math.random() * exits.length)]

    const ConfigDoc = await Config.findOne({ guildId: member.guild.id })
    if(!ConfigDoc.exit) return;
    
    const embed = new MessageEmbed()
    .setAuthor(`${member.user.tag} - ${member.id}`, member.user.displayAvatarURL({ dynamic: true }))
    .setColor('RED')
    .setDescription(`${exit}`)
    .setFooter(`User Left • ${member.guild.memberCount} `)
    .setTimestamp()

        var channelId = ConfigDoc.exitId
        var channel = member.guild.channels.cache.get(channelId)
        if(!channel){
            channelId = member.guild.systemChannelID
            channel = member.guild.channels.cache.get(member.guild.systemChannelID)
        }
        channel.send(embed)
    
}