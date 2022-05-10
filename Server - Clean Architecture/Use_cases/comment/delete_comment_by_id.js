function buildDeleteCommentById({ commentsDb, Id, AppError }) {
    return async function deleteCommentById({ commentId }) {

        if (!Id.isValid(commentId)) {
            throw new AppError("Can't delete comment by invalid id.")
        }

        await commentsDb.deleteById(commentId)
    }
}

module.exports = { buildDeleteCommentById }