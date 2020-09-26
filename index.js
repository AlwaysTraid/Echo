require('dotenv').config();
const { Client, Collection, DiscordAPIError } = require('discord.js');
const fs = require('fs');
const moment = require('moment')
const ms = require('ms')
const mongoose = require('mongoose')
const Guild = require('./models/guild');
const glob = require('glob');
const { scheduleGiveaway } = require('./util/giveaway');
const Giveaway = require(`./models/Giveaway`);
const Config = require('./models/Config');

const categories = new Collection()


const client = new Client({ disableMentions: 'everyone' });

client.commands = new Collection();
client.queue = new Map();
client.snipes = new Collection();
client.mongoose = require('./util/mongoose')


const cooldowns = new Collection();

client.on('ready', async() => {
   console.log(`${client.user.username} ready!`);

   const current = new Date()
   const giveaways = await Giveaway.find({
      endsOn: { $gt : current}
   })

   setInterval(() => {
      client.guilds.cache.forEach(async (g) =>{
         const GiveawayDoc = await Giveaway.find({ guildId: g.id})
      
         GiveawayDoc.forEach(async (gw) => {
            if(Number(gw.endsOn) < Date.now()){
               await scheduleGiveaway(client, giveaways, false)
            }
            else{
               var { channelId, messageId, endsOn, prize, gMessage, winners} = giveaways
               channelId = gw.channelId
               messageId = gw.messageId
               endsOn = gw.endsOn
               prize = gw.prize
               gMessage = gw.gMessage
               winners = gw.winners
               const channel = client.channels.cache.get(channelId)
               if (channel){
                  const message = await channel.messages.fetch(messageId)
                  if (message){
                     const {embeds} = message
                     if (embeds.length === 1){
                        const time = Number(endsOn) - Date.now()
                        const embed = embeds[0]
                        embed.setDescription(`
                        **Prize**: ${prize}\n
                        **Number of Winners**: ${winners}\n
                        **Ends In**: ${moment.duration(time).format('d [days] h [hours] m [mins and] s [seconds]')}\n
                        **JOIN the giveaway by REACTING with 🎉 to ENTER!!**
                        `)
                        message.edit(embed)
                     }
                  }
               }
            }

         })

      })

   }, 10000)

   setInterval(() => {
      const statuses = [`-help`, `Survive 2020`, `over ${client.guilds.cache.size} servers`, `over ${client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0)} members`];

      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      client.user.setActivity(randomStatus, {
         type: "WATCHING",
         url: "https://www.youtube.com/channel/UCJKeTF_LLWIWHlhJTbveLwQ"
      });
   }, 30000);
});
client.on('messageUpdate', async(oldMessage, newMessage) =>{

   require('./events/messageUpdate')(oldMessage, newMessage)

})

client.on('messageDelete', async(message) =>{

   require('./events/messageDelete')(message)

})
client.on('guildCreate', () =>{

   require('./events/guildCreate')

})
client.on('guildDelete', () =>{

   require('./events/guildDelete')

})
client.on("guildMemberAdd", (member) => {
   const foo = require('./events/guildMemberAdd')
   foo(member)
})
client.on("guildMemberRemove", (member) => {
   const foop = require('./events/guildMemberRemove')
   foop(member)
})
client.on('warn', (info) => console.log(info));
client.on('error', console.error);

const commandFiles = glob.sync('./commands/**/*.js');
for (const file of commandFiles) {
   const command = require(file);
   client.commands.set(command.name, command);
}


client.on('message', async (message) => {
   if (message.channel.type === 'dm') return
   const GuildDoc = await Guild.findOne({ guildID: message.guild.id })
   try{
      var prefix
      try {
      prefix = GuildDoc.prefix
      } catch {
         prefix = '-'
      }
   }catch(e){}

   if (!GuildDoc) {
      const newGuildDoc = new Guild({    
         guildID: message.guild.id,
         prefix: "-",
         fun: true,
         miscellaneous: true,
         moderation: false,
         botdetails: true,
         music: true,
         entertainment: false,
         giveaway: false,
         config: true,
         hungergames: true,
      })
      newGuildDoc.save()
   }

   const ConfigDoc = await Config.findOne({ guildId: message.guild.id })

   if (!ConfigDoc){
      const newConfigDoc = new Config({
         guildId: message.guild.id,
         welcome: false,
         welcomeId: "",
         exit: false,
         exitId: "",
         botlogs: false,
         botlogsId: "",
         modlogs: false,
         modlogsId: "",
         autorole: "",
      })
      newConfigDoc.save()
   }
   
   if (message.author.bot) return;
   if (!message.guild) return;

   if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command =
         client.commands.get(commandName) ||
         client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

      if (!command) return;

      if (!cooldowns.has(command.name)) {
         cooldowns.set(command.name, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 0) * 1000;

      if (timestamps.has(message.author.id)) {
         const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

         if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(
               `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
            );
         }
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      try{
         if(!GuildDoc[command.categorydetail]){
            message.delete()
            return message.author.send('That command is currently disabled. Ask someone with the MANAGE_GUILDS permission to enable the category it is listed under.')
         }else{
            try {
               command.execute(message, args, client, prefix);
            } catch (error) {
               console.error(error);
               message.reply('There was an error executing that command.').catch(console.error);
            }
         }
      }catch(e){}
   }
});

client.mongoose.init()
client.login(process.env.discord_token);
