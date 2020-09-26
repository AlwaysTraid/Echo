const { MessageEmbed, splitMessage, escapeMarkdown } = require('discord.js');

module.exports = {
   name: 'queue',
   aliases: ['q'],
   description: 'Show the music queue and now playing.',
   category: '🎶 Music',
   categorydetail: `music`,
   execute(message) {
      const queue = message.client.queue.get(message.guild.id);

      if (!queue)
         return message.channel
            .send(new MessageEmbed().setDescription(`There is nothing playing.`))
            .catch(console.error);

      const description = queue.songs.map((song, index) => `**${index + 1}.** ${escapeMarkdown(song.title)}`);

      let queueEmbed = new MessageEmbed()
         .setTitle(`${message.guild.name}'s Music Queue`)
         .setDescription(description)
         .setFooter(`${queue.songs.length} songs in the queue.`);

      const splitDescription = splitMessage(description, {
         maxLength: 2048,
         char: '\n',
         prepend: '',
         append: '',
      });

      splitDescription.forEach(async (m) => {
         queueEmbed.setDescription(m);
         message.channel.send(queueEmbed);
      });
   },
};
