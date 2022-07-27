const { UsersDB } = require("../Adapters/DB/users_db")

const Username = Object.freeze({
    isValid: (username) => {
        // Checks if username valid

        return username != null
    },
    isUsed: async (username) => {
        return (await UsersDB.isUsernameUsed(username))
    },
    generate: () => {
        // Generate Id

        return "Generated username"
    }
})

module.exports = { Username }