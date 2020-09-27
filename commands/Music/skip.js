const { MessageEmbed } = require('discord.js');
const { sameChanAsBot } = require('../../util/sameChanAsBot');

module.exports = {
   name: 'skip',
   aliases: ['s'],
   description: 'Skip the currently playing song and play the next in queue.',
   category: '🎶 Music',
   categorydetail: `music`,
   execute(message) {

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
