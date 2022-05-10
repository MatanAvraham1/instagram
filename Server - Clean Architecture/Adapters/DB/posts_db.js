const postsDb = Object.freeze({
    insert: async (post) => {
        // Insert post
    },
    deleteById: async (postId) => {
        // Deletes post by id
    },
    findById: async (postId) => {
        // returns post by id
    },
    findByPublisherId: async (publisherId, quantitiy, startIndex) => {
        // Returns some posts of user 
    },
})

module.exports = { postsDb }