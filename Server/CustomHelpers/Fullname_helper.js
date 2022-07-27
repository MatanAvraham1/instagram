
const Fullname = Object.freeze({
    generate: () => {
        // Generate Id

        return "Generated fullname"
    },
    isValid: (plainText) => {
        // Checks if valid...

        return plainText != null
    }
})

module.exports = { Fullname }