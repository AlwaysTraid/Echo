const { MessageEmbed } = require('discord.js');
const { Collection } = require("discord.js")
const Guild = require('../../models/guild');

module.exports = {
   name: 'help',
   aliases: ['h'],
   description: 'Display all commands and what they do.',
   category: '🛠️ BotDetails',
   categorydetail: `botdetails`,
   usage: '<command>',
   async execute(message, args, client, prefix) {
      message.react('👍')

      const cmd = message.client.commands.get(args[0]);

      const GuildDoc = await Guild.findOne({ guildID: message.guild.id })

      let commands = message.client.commands.array();
      const categories = new Collection()

      commands.forEach(command => {
         const category = categories.get(command.category)
         if (category) {
            category.set(command.name, command)
         } else {
            categories.set(command.category, new Collection().set(command.name, command))
         }
      })

      if (!cmd) {

         let helpEmbed = new MessageEmbed()
            .setTitle(`${message.client.user.username} Help`)
            .setThumbnail(`${client.user.displayAvatarURL()}`)
            .setDescription(`💙 You can do \`${prefix}help [command name]\` for more info on a command!\n💙Remember to \`${GuildDoc.prefix}enable\` the categories as well!\n~~~~~~~~~~~~~~~`);

            categories.forEach((category, name) => {
               helpEmbed.addField(name + ` ${GuildDoc[category.array()[0].categorydetail] ? '(Enabled)' : '(Disabled)'} `, category.map((command) => "`"+command.name+"`").join(', '))
          })
          
         
         return message.channel.send(helpEmbed).catch(console.error);
      } else {
         const data = [];

         data.push(`**Name:** \`${cmd.name}\``);
         if (cmd.category) data.push(`**Category:** \`${cmd.category}\``)
         if (cmd.description) data.push(`**Description:** \`${cmd.description}\``);
         if (cmd.aliases) data.push(`**Aliases:** \`${cmd.aliases.join(', ')}\``);
         if (cmd.cooldown) data.push(`**Cooldown:** \`${cmd.cooldown} second(s)\``);
         if (cmd.usage) data.push(`**Usage** \`${prefix}${cmd.name} ${cmd.usage} \``)

         return message.channel.send(new MessageEmbed().setDescription(data.join('\n')));
      }
   },
};