function buildGetCommentsByPostId({ PostsDB, CommentsDB, Id, AppError, AppErrorMessages }) {
    return async function getCommentsByPostId({ postId, startFromIndex }) {

        if (!Id.isValid(postId)) {
            throw new AppError(AppErrorMessages.invalidPostId)
        }

        if (!(await PostsDB.doesPostExist(postId))) {
            throw new AppError(AppErrorMessages.postDoesNotExist)
        }

        return await CommentsDB.findByPostId(postId, startFromIndex, 30)
    }
}

module.exports = { buildGetCommentsByPostId }