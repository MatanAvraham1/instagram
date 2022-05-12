require('dotenv').config()
const mongoose = require('mongoose')
const { startServer } = require('./Adapters/RestApi')

// Connects to the database (currently using mongodb)
mongoose.connect(process.env.DATABASE_URL).then((result) => { console.log("Connected to db!") }).catch((err) => {
    console.log(err)
})


startServer()