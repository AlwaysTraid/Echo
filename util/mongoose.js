const mongoose = require('mongoose')

module.exports = {

    init:() => {

        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }

        mongoose.connect('mongodb+srv://admin:TacoPineapple657@cluster0.jvpxn.mongodb.net/Echo?retryWrites=true&w=majority', dbOptions)
        mongoose.set('useFindAndModify', false)
        mongoose.Promise = global.Promise
    
        mongoose.connection.on('connected', () => {
        
            console.log('Mongoose has successfully connected!')

        })

        mongoose.connection.on('err', err => {

            console.error(`Mongoose connection error: \n${err.stack}`)

        })

        mongoose.connection.on('disconnected', () => {

            console.warn('Mongoose connection lost');

        })
    }

}