require('dotenv').config();
const { play } = require('../../util/play');
const ytdl = require('ytdl-core');
const YouTubeAPI = require('simple-youtube-api');
const { MessageEmbed } = require('discord.js');
const youtube = new YouTubeAPI(process.env.youtube_api_key);

module.exports = {
   name: 'play',
   cooldown: 3,
   description: 'Plays a song from youtube by either song url or song name.',
   category: '🎶 Music',
   categorydetail: `music`,
   usage: `<song name>`,
   async execute(message, args) {
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

      if (!args.length)
         return message.channel
            .send(new MessageEmbed().setDescription(`You need to specify a song name to play. [${message.author}]`))
            .catch(console.error);

      const permissions = channel.permissionsFor(message.client.user);
      if (!permissions.has('CONNECT'))
         return message.channel.send(new MessageEmbed(`Cannot connect to voice channel, missing permissions`));

      if (!permissions.has('SPEAK'))
         return message.channel.send(
            new MessageEmbed(`I cannot speak in this voice channel, make sure I have the proper permissions!`)
         );

      const search = args.join(' ');
      const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
      const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
      const url = args[0];
      const urlValid = videoPattern.test(args[0]);

      if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
         return message.client.commands.get('playlist').execute(message, args);
      }

      const queueConstruct = {
         textChannel: message.channel,
         channel,
         connection: null,
         songs: [],
         loop: false,
         volume: 100,
         playing: true,
      };

      let songInfo = null;
      let song = null;

      if (urlValid) {
         try {
            songInfo = await ytdl.getInfo(url);
            song = {
               author: message.author,
               artist: songInfo.videoDetails.author.name,
               title: songInfo.videoDetails.title,
               url: songInfo.videoDetails.video_url,
               duration: songInfo.videoDetails.lengthSeconds,
               thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url,
            };
         } catch (error) {
            console.error(error);
            return message.reply(error.message).catch(console.error);
         }
      } else {
         try {
            const results = await youtube.searchVideos(search, 1);
            songInfo = await ytdl.getInfo(results[0].url);
            song = {
               author: message.author,
               artist: songInfo.videoDetails.author.name,
               title: songInfo.videoDetails.title,
               url: songInfo.videoDetails.video_url,
               duration: songInfo.videoDetails.lengthSeconds,
               thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url,
            };
         } catch (error) {
            console.error(error);
            return message.channel
               .send(new MessageEmbed().setDescription(`😭 No search results where found. [${message.author}]`))
               .catch(console.error);
         }
      }

      if (serverQueue) {
         serverQueue.songs.push(song);
         return serverQueue.textChannel
            .send(
               new MessageEmbed()
                  .setThumbnail(song.thumbnail)
                  .setTitle(song.title)
                  .setURL(song.url)
                  .setDescription(`✅ **${song.title}** has been added to the queue. [${song.author}]`)
            )
            .catch(console.error);
      }

      queueConstruct.songs.push(song);
      message.client.queue.set(message.guild.id, queueConstruct);

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
   },
};
