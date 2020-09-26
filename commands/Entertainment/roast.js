const { MessageEmbed, Message } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: 'roast',
    description: 'Roast someone of your choice! Warning: Don\'t take these roasts seriously.. ',
    category: '🔥 Entertainment',
    categorydetail: `entertainment`,
    usage: `<Mention/ID>`,
    execute(message, args)  {

        member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const roasts = [
           `${member} is as useless as the 'ueue' in queue`,
           `Mirrors can't talk. Luckily for ${member}, they can't laugh either.`,
           `Hey, ${member}, you have something on your chin. Wait no, the 3rd one down.`,
           `${member} is the reason the gene pool needs a lifeguard.`,
           `If I had a face like ${member}'s I would sue my parent's reproductive system.`,
           `${member}'s only chance of getting laid is crawling up a chicken's ass and wait.`,
           `Someday, ${member} will go far. For all our sakes, I hope they stay there.`,
           `${member} must've been born on a highway because that is where most accidents happen.`,
           `If laughter was the best medicine, we'd all just need to look at ${member} to be cured.`,
           `${member}... Is your ass jealous of the amount of shit that just came out of your mouth?`,
           `One upon a time, ${member} had a thought cross their mind. It was a long and lonely journey.`,
           `If you wanted an effecient way to break your legs, then I'd suggest to jump off ${member}'s ego and land on their IQ.`,
           `If you agree with ${member}, you agree to be wrong.`,
           `The only thing I'd change if I see ${member} is the direction I was walking in.`,
           `If I had a dollar for every smart thing ${member} had said, I'd somehow get a way to owe money.`,
           `I love what you did with your hair, ${member}! How'd you get it to come out of your nose like that?`,
           `${member} is that one gray sprinkle on a rainbow sprinkle cupcake`,
           `Light travels faster than sound. That is probably why ${member} looked bright before they spoke.`,
           `${member} is so annoying that he was refused the Happy Meal.`,
           `I take ${member} everywhere I go so I don't have to kiss them goodnight.`,
           `It's impossible to understimate ${member}`,
           `I'm sorry if I hurt your feelings ${member}. I'm not trying to insult you. I'm just describing you.`,
           `${member} is the human version of period cramps.`,
           `I may love to shop, but I will never buy ${member}'s bull.`,
           `Is ${member}'s "logic" going to go into intermission anytime soon?`,
           `Sorry ${member}. I don't sugar coat shit. I'm not 21st centuries' Willy Wonka.`,
           `${member} has more roasts than there are at Mount Rushmore.`,
           `${member} is entitled to their icorrect opinion.`,
           `Can someone help me find ${member}'s off button?`,
           `I'm jealous of people who haven't met ${member} yet.`,
           `${member} is finally making sense... Time to tell my doctor to up my medication.`,
           `90% of ${member}'s "beauty" could be removed with a Kleenex.`,
           `I suggest ${member} to do a bit of soul searching. You might find one.`,
           `Why is it acceptable for ${member} to be an idiot, but not for me to point it out?`,
           `If ${member} is trying to be a smart ass, they might have forgotten the smart.`,
           `I'm not an astronomer but I'm pretty sure the Earth revolves around the Sun... not ${member}.`,
  
        ]

        const roast = roasts[Math.floor(Math.random() * roasts.length)]

        const embed = new MessageEmbed()
        .setTitle('Roast Deployed')
        .addField(`Compliments of ${message.author.username}`, roast)
        .setTimestamp()
        .setFooter(`Don't take this seriously. It's all fun and games.`)

        message.channel.send(embed)
    }
}