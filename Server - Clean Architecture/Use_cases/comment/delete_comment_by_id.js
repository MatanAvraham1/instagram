function buildDeleteCommentById({ CommentsDB, Id, AppError }) {
    return async function deleteCommentById({ commentId }) {

        if (!Id.isValid(commentId)) {
            throw new AppError("Can't delete comment by invalid id.")
        }

        if (!(await CommentsDB.doesCommentExist(commentId))) {
            throw new AppError("Comment doesn't exist.")
        }

        await CommentsDB.deleteById(commentId)
    }
}

module.exports = { buildDeleteCommentById }