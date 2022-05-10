function buildGetCommentsByPostId({ CommentsDB, Id, AppError }) {
    return async function getCommentsByPostId({ postId }) {

        if (!Id.isValid(postId)) {
            throw new AppError("Can't get comments by invalid post id.")
        }

        return await CommentsDB.findByPostId(postId)
    }
}

module.exports = { buildGetCommentsByPostId }