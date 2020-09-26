const { MessageEmbed } = require('discord.js');
const { sameChanAsBot } = require('../../util/sameChanAsBot');

module.exports = {
   name: 'stop',
   description: 'Stops all playing music and leaves the voice channel.',
   category: '🎶 Music',
   categorydetail: `music`,
   execute(message) {
      const queue = message.client.queue.get(message.guild.id);

      if (!queue)
         return message.channel
            .send(new MessageEmbed().setDescription(`There is nothing playing. [${message.author}]`))
            .catch(console.error);

      if (!sameChanAsBot(message.member)) return;

      queue.songs = [];
      queue.connection.dispatcher.end();

      message.channel
         .send(new MessageEmbed().setDescription(`⏹ I have now stopped the music! [${message.author}]`))
         .catch(console.error);
   },
};
