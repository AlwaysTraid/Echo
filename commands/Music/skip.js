const { MessageEmbed } = require('discord.js');
const { sameChanAsBot } = require('../../util/sameChanAsBot');

module.exports = {
   name: 'skip',
   aliases: ['s'],
   description: 'Skip the currently playing song and play the next in queue.',
   category: '🎶 Music',
   categorydetail: `music`,
   execute(message) {
      const queue = message.client.queue.get(message.guild.id);

      if (!queue)
         return message.channel
            .send(
               new MessageEmbed().setDescription(
                  `There is nothing playing that I could skip for you. [${message.author}]`
               )
            )
            .catch(console.error);

      if (!sameChanAsBot(message.member)) return;

      queue.playing = true;
      queue.loop = false;
      queue.connection.dispatcher.end();

      message.channel
         .send(new MessageEmbed().setDescription(`⏭ I have skipped the song. [${message.author}]`))
         .catch(console.error);
   },
};
