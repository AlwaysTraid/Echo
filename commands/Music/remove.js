const { MessageEmbed } = require('discord.js');
const { sameChanAsBot } = require('../../util/sameChanAsBot');

module.exports = {
   name: 'remove',
   description: 'Remove song from the queue.',
   category: '🎶 Music',
   categorydetail: `music`,
   usage: `<song queue number>`,
   execute(message, args) {

      const { channel } = message.member.voice;

      const serverQueue = message.client.queue.get(message.guild.id);
      
      if (!channel)
         return message.channel
            .send(new MessageEmbed().setDescription(`You need to join a voice channel first! [${message.author}]`))
            .catch(console.error);

      if (serverQueue && channel !== message.guild.me.voice.channel)
         return message.channel
            .send(
               new MessageEmbed().setDescription(
                  `You must be in the same channel as ${message.client.user}. [${message.author}]`
               )
            )
            .catch(console.error);

      const queue = message.client.queue.get(message.guild.id);

      if (!queue)
         return message.channel
            .send(new MessageEmbed().setDescription(`There is nothing playing. [${message.author}]`))
            .catch(console.error);

      if (!sameChanAsBot(message.member)) return;

      if (!args.length)
         return message.channel.send(
            new MessageEmbed().setDescription(
               `You need to specify a song to remove from the queue. [${message.author}]`
            )
         );

      if (isNaN(args[0]))
         return message.channel.send(
            new MessageEmbed().setDescription(`You need to specify a value song queue number. [${message.author}]`)
         );

      const song = queue.songs.splice(args[0] - 1, 1);

      message.channel.send(new MessageEmbed().setDescription(`❌ I have removed **${song[0].title}** from the queue.`));
   },
};
