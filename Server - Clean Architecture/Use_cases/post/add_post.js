const { makePost } = require("../../Entities/post"

function buildAddPost({ postsDb }) {
        return async function addPost({ publisherId, structure }) {
            const post = makePost({ publisherId, structure })

            await postsDb.insert(post)
        }
    }

module.exports = { buildAddPost }