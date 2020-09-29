const ytdlDiscord = require('ytdl-core-discord');
const { MessageEmbed } = require('discord.js');

module.exports = {
   async play(song, message) {
      const queue = message.client.queue.get(message.guild.id);

      if (!song) {
         queue.channel.leave();
         message.client.queue.delete(message.guild.id);
         return queue.textChannel.send(new MessageEmbed().setDescription(`🛑 Music queue ended.`)).catch(console.error);
      }

      try {
         var stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25, headers:{ 'Cookie': `${song.url}`} });
      } catch (error) {
         console.log(error);
         if (queue) {
            queue.songs.shift();
            module.exports.play(queue.songs[0], message);
         }

         return message.channel.send(new MessageEmbed().setDescription(`There seems to have been an error`));
      }

      queue.connection.on('disconnect', () => message.client.queue.delete(message.guild.id));

      const dispatcher = queue.connection
         .play(stream, { type: 'opus' })
         .on('finish', () => {
            if (queue.loop) {
               module.exports.play(queue.songs[0], message);
            } else {
               queue.songs.shift();
               module.exports.play(queue.songs[0], message);
            }
         })
         .on('error', () => {
            queue.songs.shift();
            module.exports.play(queue.songs[0], message);
         });
      dispatcher.setVolumeLogarithmic(queue.volume / 100);

      queue.textChannel
         .send(new MessageEmbed().setDescription(`🎶 Started playing: **${song.title}** [${song.author}]`))
         .then((msg) => msg.delete({ timeout: song.duration * 1000 }))
         .catch(console.error);
   },
};
