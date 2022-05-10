const { makePost } = require("../../Entities/post")

function buildAddPost({ PostsDB }) {
    return async function addPost({ publisherId, photos, publisherComment = null, location = null, taggedUsers = [] }) {
        const post = makePost({ publisherId, photos, publisherComment, location, taggedUsers })

        await PostsDB.insert(post)
        return post.id
    }
}

module.exports = { buildAddPost }