const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: '8ball',
    aliases: ['eightball'],
    description: 'An eightball will answer your deepest darkest questions!',
    category: '🎱 Fun',
    categorydetail: `fun`,
    usage: `<question>`,
    execute(message, args)  {
        const answers = [
            "Yes.",
            "My sources say yes",
            "Most likely.",
            "Absolutely",
            "Maybe sometime",
            "Outlook good.",
            "Signs point to yes.",
            "Definitely",
            "Idk",
            "No.",
            "Nope.",
            "Why don't we put a pin on that",
            "Not possible!",
            "I want to say yes, but my coding says no.",
            "No thanks, I won’t be able to make it.",
            "No Way!",
            "Nuh-uh!",
            "Do I look like a fortune teller to you?",
            "Yeahhh... no",
            "Definitely not",
            "I would hope not",
            "My sources say no",
            "Not likely",
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes - definitely.",
            "You may rely on it.",
            "As I see it, yes."
            ]

        const question = args.join(" ")

        if (!question) return message.channel.send("Please provide a valid question")

        const answer = answers[Math.floor(Math.random() * answers.length)]

        const embed = new MessageEmbed()
            .setTitle("8Ball")
            .setThumbnail('https://cdn.discordapp.com/attachments/751169425117282304/752623909421056120/8Ball.png')
            .addField("Question:", question)
            .addField("Answer:", answer)
            .setColor("BLUE")
            .setFooter(message.author.username)
            .setTimestamp()

        message.channel.send(embed)
    }
}