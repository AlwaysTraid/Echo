const { MessageEmbed } = require('discord.js');
const { sameChanAsBot } = require('../../util/sameChanAsBot');

module.exports = {
   name: 'loop',
   aliases: ['l'],
   description: 'Makes to current playing music song play over and over.',
   category: '🎶 Music',
   categorydetail: `music`,
   execute(message) {
      const queue = message.client.queue.get(message.guild.id);

      if (!queue)
         return message.channel
            .send(new MessageEmbed().setDescription(`There is nothing playing. [${message.author}]`))
            .catch(console.error);

      if (!sameChanAsBot(message.member)) return;

      queue.loop = !queue.loop;

      return message.channel
         .send(
            new MessageEmbed().setDescription(
               `🔁 I have now set loop ${queue.loop ? '**on**' : '**off**'}. [${message.author}]`
            )
         )
         .catch(console.error);
   },
};
