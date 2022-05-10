const { makeComment } = require("../../Entities/comment")

function buildAddComment({ commentsDb }) {
    return async function addComment({ publisherId, structure }) {
        const comment = makeComment({ publisherId, structure })

        await commentsDb.insert(comment)
    }
}

module.exports = { buildAddComment }