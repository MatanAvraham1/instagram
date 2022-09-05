function buildUnlikePost({ UsersDB, PostsDB, Id, AppError, AppErrorMessages }) {
    return async function unlikePost({ postId, likerId }) {

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

        if (!(await PostsDB.isLiked(postId, likerId))) {
            throw new AppError(AppErrorMessages.alreadyUnliked)
        }

        return await PostsDB.unlikePost(postId, likerId)
    }
}

module.exports = { buildUnlikePost }