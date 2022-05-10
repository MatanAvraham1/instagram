const { makeComment } = require("../../Entities/comment")

function buildAddComment({ CommentsDB }) {
    return async function addComment({ publisherId, postId, comment, replyToComment = null }) {
        const comment = makeComment({ publisherId, postId, comment, replyToComment })

        await CommentsDB.insert(comment)
        return comment.id
    }
}

module.exports = { buildAddComment }