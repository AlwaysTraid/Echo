const { MessageEmbed } = require('discord.js');

module.exports = {
   name: 'nowplaying',
   aliases: ['np'],
   description: 'Show the current playing song.',
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
            .send(new MessageEmbed().setDescription(`There is nothing playing. [${message.author}]`))
            .catch(console.error);

      const song = queue.songs[0];

      let nowPlaying = new MessageEmbed()
         .setAuthor('Current Song')
         .setDescription(`▶️ **${song.title}** by ${song.artist} [${song.author}]`)
         .setThumbnail(song.thumbnail);

      if (song.duration > 0)
         nowPlaying.setFooter(`Song Duration: ${new Date(song.duration * 1000).toISOString().substr(11, 8)}`);

      return message.channel.send(nowPlaying);
   },
};
