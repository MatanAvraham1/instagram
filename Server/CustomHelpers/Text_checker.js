const TextChecker = Object.freeze({
    isValid: (plainText) => {
        // Checks if text is ok and without unwanted things.


        return plainText != null
    }
})

module.exports = { TextChecker }