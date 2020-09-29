const { MessageEmbed } = require('discord.js');

module.exports = {
   sameChanAsBot(member) {
      const { channel } = member.voice;
      const botChannel = member.guild.me.voice.channel;

      if (channel !== botChannel) {
         member
            .send(new MessageEmbed().setDescription(`You need to be in the same channel with the bot. [${member}]`))
            .catch(console.error);
         return false;
      }

      return true;
   },
};
