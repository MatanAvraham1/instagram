function buildGetRepliesComments({ CommentsDB, Id, AppError }) {
    return async function getRepliesComments({ commentId, startFromIndex }) {

        if (!Id.isValid(replyToComment)) {
            throw new AppError("Can't get replies of invalid comment id.")
        }

        if (!(await CommentsDB.doesCommentExist(commentId))) {
            throw new AppError("Comment doesn't exist.")
        }

        return await CommentsDB.findReplies(commentId, startFromIndex, 30)
    }
}

module.exports = { buildGetRepliesComments }