function buildDeletePostById({ PostsDB, Id, AppError, AppErrorMessages }) {
    return async function deletePostById({ postId }) {

        if (!Id.isValid(postId)) {
            throw new AppError(AppErrorMessages.invalidPostId)
        }

        if (!(await PostsDB.doesPostExist(postId))) {
            throw new AppError(AppErrorMessages.postDoesNotExist)
        }

        await PostsDB.deleteById(postId)
    }
}

module.exports = { buildDeletePostById }