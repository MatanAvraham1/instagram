require('dotenv').config()
const mongoose = require('mongoose');
const { deleteChat, createChat } = require('../models/chat_model');
const { updateUser } = require('../models/user_model');
// Connects to the database
mongoose.connect(process.env.DATABASE_URL).then((result) => {
    console.log("Connected to db!");
    setTimeout(async () => {

        updateUser("622f97a321c0085366f3b237", "dvir hamalshin")

    }, 0)
}).catch((err) => {
    console.log(err)
})



