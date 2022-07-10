function buildIsPostLiked({ UsersDB, PostsDB, Id, AppError, AppErrorMessages }) {
    return async function isPostLiked({ postId, likerId }) {

        // checks if user [likerId] likes the post [postId]

        if (!Id.isValid(likerId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        if (!Id.isValid(postId)) {
            throw new AppError(AppErrorMessages.invalidPostId)
        }

        if (!(await UsersDB.doesUserExist({ userId: likerId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        if (!(await PostsDB.doesPostExist(postId))) {
            throw new AppError(AppErrorMessages.postDoesNotExist)
        }

        await PostsDB.isLiked(postId, likerId)
    }
}

module.exports = { buildIsPostLiked }