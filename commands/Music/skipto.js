const { MessageEmbed } = require('discord.js');
const { sameChanAsBot } = require('../../util/sameChanAsBot');

module.exports = {
   name: 'skipto',
   aliases: ['st'],
   description: 'Skip to the selected queue song number.',
   category: '🎶 Music',
   categorydetail: `music`,
   usage: `<song queue number>`,
   execute(message, args) {
      const queue = message.client.queue.get(message.guild.id);

      if (!queue)
         return message.channel
            .send(new MessageEmbed().setDescription(`There is nothing playing. [${message.author}]`))
            .catch(console.error);

      if (!sameChanAsBot(message.member)) return;

      if (!args[0])
         return message.channel.send(new MessageEmbed().setDescription(`You need to specify a song to skip to`));

      if (isNaN(args[0])) return message.channel.send(new MessageEmbed().setDescription(`That is not a valid song`));

      if (args[0] > queue.songs.length || args[0] <= 0)
         return message.channel.send(new MessageEmbed().setDescription('That is not a valid song from the queue.'));

      queue.playing = true;
      queue.loop = false;

      queue.songs = queue.songs.slice(args[0] - 2);
      queue.connection.dispatcher.end();

      message.channel
         .send(new MessageEmbed().setDescription(`⏭ I have skipped ${args[0] - 1} songs. [${message.author}]`))
         .catch(console.error);
   },
};
