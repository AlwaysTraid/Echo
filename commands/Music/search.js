require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const YouTubeAPI = require('simple-youtube-api');
const youtube = new YouTubeAPI(process.env.youtube_api_key);

module.exports = {
   name: 'search',
   description: 'Search and select a video to play.',
   category: '🎶 Music',
   categorydetail: `music`,
   usage: `<song name>`,
   async execute(message, args) {
      const serverQueue = message.client.queue.get(message.guild.id);
      const { channel } = message.member.voice;

      if (!args.length)
         return message.channel
            .send(
               new MessageEmbed().setDescription(`You need to specify a song name to search for. [${message.author}]`)
            )
            .catch(console.error);

      if (message.channel.activeCollector)
         return message.channel.send(
            new MessageEmbed().setDescription(`There is already a searching in this channel. [${message.author}]`)
         );

      if (serverQueue && channel !== message.guild.me.voice.channel)
         return message.channel
            .send(new MessageEmbed().setDescription(`You need to join a voice channel first! [${message.author}]`))
            .catch(console.error);

      const search = args.join(' ');

      let resultsEmbed = new MessageEmbed()
         .setTitle(`**Reply with the song number you want to play**`)
         .setDescription(`Results for: **${search}**`);

      try {
         var results = await youtube.searchVideos(search, 5);
         results.map((video, index) =>
            resultsEmbed.addField(
               entities.decode(`${index + 1}. ${video.title}`),
               `By: \`${video.channel.raw.snippet.channelTitle}\`, Video URL: [Video URL](${video.url})`
            )
         );

         var resultsMessage = await message.channel.send(resultsEmbed);

         function filter(msg) {
            const pattern = /(^[1-9][0-9]{0,1}$)/g;
            return pattern.test(msg.content) && parseInt(msg.content.match(pattern)[0]) <= 10;
         }

         message.channel.activeCollector = true;
         const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] });
         const choice = results[parseInt(response.first()) - 1].url;

         message.channel.activeCollector = false;

         message.client.commands.get('play').execute(message, [choice]);

         resultsMessage.delete().catch(console.error);
         message.delete().catch(console.error);
         response.first().delete().catch(console.error);
      } catch (error) {
         console.error(error);
         message.channel.activeCollector = false;
      }
   },
};
