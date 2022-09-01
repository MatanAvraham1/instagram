
require('dotenv').config()
const mongoose = require('mongoose')
const { userModel } = require('./Adapters/DB/schemes/user_scheme')
// Connects to the database (currently using mongodb)
mongoose.connect(process.env.DATABASE_URL).then(async (result) => {
    console.log("Connected to db!");

    const a = await userModel.findByIdAndRemove("62d6d3eb94926b26c27b2b96", { projection: { followers: 0, followRequests: 0 } })
    console.log(a);
}).catch((err) => {
    console.log(err)

})