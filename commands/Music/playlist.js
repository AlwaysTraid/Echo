require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const { play } = require('../../util/play');
const YouTubeAPI = require('simple-youtube-api');
const youtube = new YouTubeAPI(process.env.youtube_api_key);

module.exports = {
   name: 'playlist',
   cooldown: 3,
   aliases: ['pl'],
   description: 'Play a playlist from youtube or by url.',
   category: '🎶 Music',
   categorydetail: `music`,
   async execute(message, args) {
      const { channel } = message.member.voice;

      const serverQueue = message.client.queue.get(message.guild.id);
      if (serverQueue && channel !== message.guild.me.voice.channel)
         return message.channel
            .send(
               new MessageEmbed().setDescription(
                  `You must be in the same channel as ${message.client.user}. [${message.author}]`
               )
            )
            .catch(console.error);

      if (!args.length)
         return message
            .reply(`You need to specify a playlist name or url to play. [${message.author}]`)
            .catch(console.error);

      if (!channel)
         return message.channel
            .send(new MessageEmbed().setDescription(`You need to join a voice channel first!`))
            .catch(console.error);

      const permissions = channel.permissionsFor(message.client.user);

      if (!permissions.has('CONNECT'))
         return message.channel
            .send(new MessageEmbed().setDescription(`Cannot connect to voice channel, make sure I have permissions.`))
            .catch(console.error);

      if (!permissions.has('SPEAK'))
         return message.channel
            .send(new MessageEmbed().setDescription(`I don't have permissions to speak in this channel. Fix that!`))
            .catch(console.error);

      const search = args.join(' ');
      const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
      const url = args[0];
      const urlValid = pattern.test(args[0]);

      const queueConstruct = {
         textChannel: message.channel,
         channel,
         connection: null,
         songs: [],
         loop: false,
         volume: 100,
         playing: true,
      };

      let song = null;
      let playlist = null;
      let videos = [];

      if (urlValid) {
         try {
            playlist = await youtube.getPlaylist(url, { part: 'snippet' });
            videos = await playlist.getVideos(50, { part: 'snippet' });
         } catch (error) {
            console.error(error);
            return message.channel
               .send(new MessageEmbed().setDescription(`😭 No playlist was found. [${message.author}]`))
               .catch(console.error);
         }
      } else {
         try {
            const results = await youtube.searchPlaylists(search, 1, { part: 'snippet' });
            playlist = results[0];
            videos = await playlist.getVideos(50, { part: 'snippet' });
         } catch (error) {
            console.error(error);
            return message.channel
               .send(new MessageEmbed().setDescription(`😭 No playlist was found. [${message.author}]`))
               .catch(console.error);
         }
      }

      videos.forEach((video) => {
         song = {
            title: video.title,
            url: video.url,
            duration: video.durationSeconds,
         };

         if (serverQueue) {
            serverQueue.songs.push(song);
         } else {
            queueConstruct.songs.push(song);
         }
      });

      let playlistEmbed = new MessageEmbed()
         .setTitle(`✅ ${playlist.title} has been added to the queue. [${message.author}]`)
         .setURL(playlist.url);

      message.channel.send(playlistEmbed);

      if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

      if (!serverQueue) {
         try {
            queueConstruct.connection = await channel.join();
            await queueConstruct.connection.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0], message);
         } catch (error) {
            console.error(error);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel
               .send(new MessageEmbed().setDescription(`Could not join the channel: ${error}`))
               .catch(console.error);
         }
      }
   },
};
