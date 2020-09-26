const mongoose = require('mongoose')
const Guild = require('../models/guild')

mongoose.models.exports = async (client, guild) => {

    Guild.findOneAndDelete({

        guildID: guild.guildID


    }, (err, res) => {

        if(err) console.error(err)
        console.log('I have been removed from a server!')

    })


}