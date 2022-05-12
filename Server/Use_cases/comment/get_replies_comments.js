function buildGetRepliesComments({ CommentsDB, Id, AppError, AppErrorMessages }) {
    return async function getRepliesComments({ commentId, startFromIndex }) {

        if (!Id.isValid(replyToComment)) {
            throw new AppError(AppErrorMessages.invalidCommentId)
        }

        if (!(await CommentsDB.doesCommentExist(commentId))) {
            throw new AppError(AppErrorMessages.commentDoesNotExist)
        }

        return await CommentsDB.findReplies(commentId, startFromIndex, 30)
    }
}

module.exports = { buildGetRepliesComments }