const { deleteUser, getUserById, doesUsernameAlreadyUsed, getUserByUsername, getUserByFullname, clearFollowRequests, updateUser } = require("./models/User");
const mongoose = require('mongoose')
require('dotenv').config()


// Connects to the database
mongoose.connect(process.env.DATABASE_URL).then((result) => { console.log("Connected to db!") }).catch((err) => {
    console.log(err)
})

setTimeout(async () => {

    // await updateUser("dasdas", { dsa: "dasds" })
}, 1000);
