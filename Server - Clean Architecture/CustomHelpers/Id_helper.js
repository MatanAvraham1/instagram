const mongoose = require("mongoose")

const Id = Object.freeze({
    generate: () => {
        // Generate Id

        return new mongoose.Types.ObjectId().toString()
    },
    isValid: (plainText) => {
        // Checks if id valid...

        try {
            const id = mongoose.Types.ObjectId(plainText)
            return true
        }
        catch (err) {
            return false
        }
    }
})

module.exports = { Id }