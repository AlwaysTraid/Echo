const { Client, Collection, DiscordAPIError, Message } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const axios = require('axios')

module.exports = {
    name: 'covid',
    aliases: ['covid19'],
    description: 'Get covid facts and information',
    category: '🔥 Entertainment',
    categorydetail: `entertainment`,
    async execute(message, args, client) {

        const baseurl = 'https://disease.sh/v3/covid-19'

        let url;
        let response;
        let corona;
        try{
            url = args[0] ? `${baseurl}/countries/${args[0]}` : `${baseurl}/all`
            response = await axios.get(url)
            corona = response.data
        }
        catch(e){
            return message.channel.send(`Error.. Could not find the country **${args[0]}**`)
        }
        const coronaEmbed = new MessageEmbed()
        .setTitle(args[0] ? `${args[0].toUpperCase()} Stats` : `Corona Cases Worldwide`)
        .setColor('YELLOW')
        .setThumbnail(args[0] ? corona.countryInfo.flag : 'https://media.giphy.com/media/kgsBIWtPd5Q5Pw11Rq/giphy.gif')
        .addFields(
            {
                name: '😬 Total Cases:',
                value: corona.cases.toLocaleString()
            },
            {
                name: '🏥 Total Recovered:',
                value: corona.recovered.toLocaleString()
            },
            {
                name: '💀 Total Deaths:',
                value: corona.deaths.toLocaleString()
            },
            {
                name: '😣 Total Active Cases:',
                value: corona.active.toLocaleString()
            },
            {
                name: '💉 Total Tests:',
                value: corona.tests.toLocaleString()
            },
            {
                name: '😬 Today\'s cases:',
                value: corona.todayCases.toLocaleString()
            },
            {
                name: '🏥 Today\'s Recovery Count:',
                value: corona.todayRecovered.toLocaleString()
            },
            {
                name: '💀 Today\'s Death Count:',
                value: corona.todayDeaths.toLocaleString()
            },
        )
        message.channel.send(coronaEmbed)
    }
}