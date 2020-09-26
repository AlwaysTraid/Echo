const mongoose = require('mongoose')

const ConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    welcome: { type: Boolean, required: false },
    welcomeId: { type: String, required: false },
    exit: { type: Boolean, required: false },
    exitId: { type: String, required: false },
    botlogs: { type: Boolean, required: false },
    botlogsId: { type: String, required: false },
    modlogs: { type: Boolean, required: false },
    modlogsId: { type: String, required: false },
    autorole: {type: String, required: false },
})

module.exports = mongoose.model('Config', ConfigSchema, 'configs')