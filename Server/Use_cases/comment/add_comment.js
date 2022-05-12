const { makeComment } = require("../../Entities/comment")

function buildAddComment({ CommentsDB }) {
    return async function addComment({ publisherId, postId, comment, replyToComment = null }) {
        const commentObject = await makeComment({ publisherId, postId, comment, replyToComment })

        await CommentsDB.insert(commentObject)
        return commentObject.id
    }
}

module.exports = { buildAddComment }