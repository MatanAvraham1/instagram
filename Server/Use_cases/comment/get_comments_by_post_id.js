function buildGetCommentsByPostId({ PostsDB, CommentsDB, Id, AppError }) {
    return async function getCommentsByPostId({ postId, startFromIndex }) {

        if (!Id.isValid(postId)) {
            throw new AppError("Can't get comments by invalid post id.")
        }

        if (!(await PostsDB.doesPostExist(postId))) {
            throw new AppError("Post doesn't exist.")
        }

        return await CommentsDB.findByPostId(postId, startFromIndex, 30)
    }
}

module.exports = { buildGetCommentsByPostId }