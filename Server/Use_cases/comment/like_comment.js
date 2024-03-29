function buildLikeCommentById({ UsersDB, CommentsDB, Id, AppError, AppErrorMessages }) {
    return async function likeCommentById({ commentId, likerId }) {

        if (!Id.isValid(likerId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        if (!Id.isValid(commentId)) {
            throw new AppError(AppErrorMessages.invalidCommentId)
        }

        if (!(await UsersDB.doesUserExist({ userId: likerId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        if (!(await CommentsDB.doesCommentExist(commentId))) {
            throw new AppError(AppErrorMessages.commentDoesNotExist)
        }

        if (await CommentsDB.isLiked(commentId, likerId)) {
            throw new AppError(AppErrorMessages.alreadyLiked)
        }

        return await CommentsDB.likeComment(commentId, likerId)
    }
}

module.exports = { buildLikeCommentById }