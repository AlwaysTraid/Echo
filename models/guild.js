const mongoose = require('mongoose')

const guildSchema = mongoose.Schema({

    id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    prefix: {  
        default: '-',
        type: String
    },
    fun: {
        default: true,
        type: Boolean
    },
    miscellaneous: {
        default: true,
        type: Boolean
    },
    moderation: {
        default: false,
        type: Boolean
    },
    botdetails: {
        default: true,
        type: Boolean
    },
    music: {
        default: true,
        type: Boolean
    },
    entertainment: {
        default: false,
        type: Boolean
    },
    giveaway: {
        default: false,
        type: Boolean
    },
    config: {
        default: true,
        type: Boolean
    },
    hungergames: {
        default: true,
        type: Boolean
    },
})

module.exports = mongoose.model('Guild', guildSchema, 'guilds')