const storiesDb = Object.freeze({
    insert: async (story) => {
        // Insert story
    },
    deleteById: async (storyId) => {
        // Deletes story by id
    },
    findById: async (storyId) => {
        // returns story by id
    },
    findByPublisherId: async (publisherId, quantitiy, startIndex) => {
        // Returns some stories of user 
    },
})

module.exports = { storiesDb }