const dateformat = require('dateformat')
const Discord = require('discord.js')

const filterLevels = {
    DISABLED: 'Off',
    MEMBERS_WITHOUT_ROLES: 'No Role',
    ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: '(╯°□°）╯︵ ┻━┻',
    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
    "india": ":flag_in: India",
    "brazil": ":flag_br: Brazil",
    "eu-central": ":flag_eu: Central Europe",
    "singapore": ":flag_za: Singapore",
    "london": "London",
    "russia": ":flag_ru: Russia",
    "japan": ":flag_jp: Japan",
    "hongkong": ":flag_hk: Hongkong",
    "sydney": ":flag_au: Sydney",
    "us-central": ":flag_um: U.S. Central",
    "us-east": ":flag_um: U.S. East",
    "us-south": ":flag_um: U.S. South",
    "us-west": ":flag_um: U.S. West",
}


module.exports = {
    name: "serverinfo",
    aliases: ["si"],
    description: 'Displays the information about the server.',
    category: '💡 Miscellaneous',
    categorydetail: `miscellaneous`,
    async execute(message) {
        let icon = message.guild.iconURL({
            size: 2048
        });

        // Members
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        let member = message.guild.members;
        let offline = member.cache.filter(m => m.user.presence.status === "offline").size,
            online = member.cache.filter(m => m.user.presence.status === "online").size,
            idle = member.cache.filter(m => m.user.presence.status === "idle").size,
            dnd = member.cache.filter(m => m.user.presence.status === "dnd").size,
            robot = member.cache.filter(m => m.user.bot).size,
            total = message.guild.memberCount;
            usercount = member.cache.filter(member => !member.user.bot).size;

        // Channels
        let channels = message.guild.channels;
        let text = channels.cache.filter(r => r.type === "text").size,
            vc = channels.cache.filter(r => r.type === "voice").size,
            category = channels.cache.filter(r => r.type === "category").size,
            totalchan = channels.cache.size;

        // Region
        let location = regions[message.guild.region];

        //Emojis
        const emojis = message.guild.emojis.cache;

        // Date
        let x = Date.now() - message.guild.createdAt;
        let h = Math.floor(x / 86400000)
        let created = dateformat(message.guild.createdAt);

        const embed = new Discord.MessageEmbed()
          .setColor(0x7289da)
          .setFooter(`ID: ${message.guild.id}`)
          .setTimestamp(new Date())
          .setThumbnail(
            message.guild.iconURL({
              format: "png",
              dynamic: true,
            })
          )
          .setTitle(`${message.guild.name}`)
          .addFields(
            {
              name: "**Guild Owner**",
              value: `${message.guild.owner.user.tag}`,
              inline: true,
            },
            {
              name: "**Region**",
              value: `${location}`,
              inline: true,
            },
            {
              name: "**Date Created:**",
              value: `${created} \nSince **${h}** day(s)`,
              inline: true,
            },
            {
              name: "**Boost Tier:**",
              value: `${
                message.guild.premiumTier
                  ? `Tier ${message.guild.premiumTier}`
                  : "None"
              }`,
              inline: true,
            },
            {
                name: "**Boost Count**",
                value: `${message.guild.premiumSubscriptionCount || "0"}`,
                inline: true,
            },
            {
              name: "**Explicit Filter:**",
              value: `${filterLevels[message.guild.explicitContentFilter]}`,
              inline: true,
            },
            {
              name: "**Verification Level**",
              value: `${
                verificationLevels[message.guild.verificationLevel]
              }`,
              inline: true,
            },
            {
                name: "**Total Emojis**",
                value: `${emojis.size}`,
                inline: true,
            },
            {
              name: "**Total Roles**",
              value: `${roles.length - 1}`,
              inline: true,
            },
            {
              name: `**Channels [${totalchan}]**`,
              value: `Text: ${text} \nVoice: ${vc} \nCategory: ${category}`,
              inline: true,
            },
            {
              name: `**Members [${total}]**`,
              value: `Online: ${online} \nIdle: ${idle} \nDo not Disturb: ${dnd} \nOffline: ${offline} \nHumans: ${usercount} \nBots: ${robot}\n Total Count: ${total}`,
              inline: true,
            },
            
          );
        message.channel.send(embed);

    }
}