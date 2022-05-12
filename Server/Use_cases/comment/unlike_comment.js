function buildUnlikeCommentById({ UsersDB, CommentsDB, Id, AppError, AppErrorMessages }) {
    return async function unlikeCommentById({ commentId, likerId }) {

        if (!Id.isValid(likerId)) {
            throw new AppError(AppErrorMessages.InvalidUserId)
        }

        if (!Id.isValid(commentId)) {
            throw new AppError(AppErrorMessages.InvalidCommentId)
        }

        if (!(await UsersDB.doesUserExist(likerId))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        if (!(await CommentsDB.doesCommentExist(commentId))) {
            throw new AppError(AppErrorMessages.commentDoesNotExist)
        }

        return await CommentsDB.unlikeComment(commentId, likerId)
    }
}

module.exports = { buildUnlikeCommentById }