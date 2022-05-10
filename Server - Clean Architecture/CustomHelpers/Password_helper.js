const bcrypt = require('bcryptjs')

const Password = Object.freeze({
    hash: async (plainText) => {
        // Hash password

        const hashedPassword = await bcrypt.hash(plainText, 10);
        return hashedPassword
    },
    checkPassword: async (hashedPassword, plainText) => {
        // Checks if equal

        return await bcrypt.compare(plainText, hashedPassword)
    },
    isValid: (plainText) => {
        return true
    }
})

module.exports = { Password }