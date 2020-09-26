const { MessageEmbed } = require('discord.js');
const { sameChanAsBot } = require('../../util/sameChanAsBot');

module.exports = {
   name: 'volume',
   aliases: ['v'],
   description: 'Change volume of currently playing music.',
   category: '🎶 Music',
   categorydetail: `music`,
   usage: `<Number for volume %>`,
   execute(message, args) {
      const queue = message.client.queue.get(message.guild.id);

      if (!queue)
         return message.channel
            .send(new MessageEmbed().setDescription(`There is nothing playing. [${message.author}]`))
            .catch(console.error);

      if (!sameChanAsBot(message.member))
         return message.channel
            .send(
               new MessageEmbed().setDescription(`You need to be in a voice channel to play music. [${message.author}]`)
            )
            .catch(console.error);

      if (!args[0])
         return message.channel
            .send(
               new MessageEmbed().setDescription(`🔊 The current volume is: **${queue.volume}%** [${message.author}]`)
            )
            .catch(console.error);

      if (isNaN(args[0]))
         return message.channel
            .send(new MessageEmbed().setDescription(`Please specify a number to set volume. [${message.author}]`))
            .catch(console.error);

      if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
         return message.channel
            .send(new MessageEmbed().setDescription(`Please use a number between 0 - 100. [${message.author}]`))
            .catch(console.error);

      queue.volume = args[0];
      queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

      return message.channel
         .send(
            new MessageEmbed().setDescription(`🔊 I have now set the volume to: **${args[0]}%** [${message.author}]`)
         )
         .catch(console.error);
   },
};
