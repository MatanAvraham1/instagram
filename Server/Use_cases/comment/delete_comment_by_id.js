function buildDeleteCommentById({ CommentsDB, Id, AppError, AppErrorMessages }) {
    return async function deleteCommentById({ commentId }) {

        if (!Id.isValid(commentId)) {
            throw new AppError(AppErrorMessages.invalidCommentId)
        }

        if (!(await CommentsDB.doesCommentExist(commentId))) {
            throw new AppError(AppErrorMessages.commentDoesNotExist)
        }

        await CommentsDB.deleteById(commentId)
    }
}

module.exports = { buildDeleteCommentById }