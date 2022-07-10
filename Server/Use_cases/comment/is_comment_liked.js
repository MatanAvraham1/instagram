function buildIsCommentLiked({ UsersDB, CommentsDB, Id, AppError, AppErrorMessages }) {
    return async function isCommentLiked({ commentId, likerId }) {

        // checks if user [likerId] likes the comment [commentId]

        if (!Id.isValid(likerId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        if (!Id.isValid(commentId)) {
            throw new AppError(AppErrorMessages.invalidCommentId)
        }

        if (!(await UsersDB.doesUserExist({ userId: likerId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        if (!(await CommentsDB.doesCommentExist(postId))) {
            throw new AppError(AppErrorMessages.commentDoesNotExist)
        }

        await CommentsDB.isLiked(commentId, likerId)
    }
}

module.exports = { buildIsCommentLiked }