function buildGetCommentByid({ CommentsDB, Id, AppError, AppErrorMessages }) {
    return async function getUserById({ commentId }) {


        if (!Id.isValid(commentId)) {
            throw new AppError(AppErrorMessages.invalidCommentId)
        }

        if (!(await CommentsDB.doesCommentExist(commentId))) {
            throw new AppError(AppErrorMessages.commentDoesNotExist)
        }

        return await CommentsDB.findById(commentId)
    }
}

module.exports = { buildGetCommentByid }