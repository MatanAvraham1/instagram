function buildLikePost({ UsersDB, PostsDB, Id, AppError, AppErrorMessages }) {
    return async function likePost({ postId, likerId }) {

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

        if (await PostsDB.isLiked(postId, likerId)) {
            throw new AppError(AppErrorMessages.alreadyLiked)
        }

        return await PostsDB.likePost(postId, likerId)
    }
}

module.exports = { buildLikePost }