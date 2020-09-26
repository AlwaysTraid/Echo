const { MessageEmbed } = require('discord.js');
const { sameChanAsBot } = require('../../util/sameChanAsBot');

module.exports = {
   name: 'resume',
   description: 'Resume currently playing music.',
   category: '🎶 Music',
   categorydetail: `music`,
   execute(message) {
      const queue = message.client.queue.get(message.guild.id);
      if (!queue)
         return message.channel
            .send(new MessageEmbed().setDescription(`There is nothing playing. [${message.author}]`))
            .catch(console.error);

      if (!sameChanAsBot(message.member)) return;

      if (!queue.playing) {
         queue.playing = true;
         queue.connection.dispatcher.resume();
         return message.channel
            .send(new MessageEmbed().setDescription(`▶ I have now **resumed** the music for you. [${message.author}]`))
            .catch(console.error);
      } else {
         return message.channel
            .send(new MessageEmbed().setDescription(`The queue is not paused. [${message.author}]`))
            .catch(console.error);
      }
   },
};
