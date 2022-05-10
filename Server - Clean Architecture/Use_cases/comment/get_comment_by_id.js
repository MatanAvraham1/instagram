function buildGetCommentByid({ commentsDb, Id, AppError }) {
    return async function getUserById({ commentId }) {


        if (!Id.isValid(commentId)) {
            throw new AppError("Can't get comment by invalid id.")
        }

        return await commentsDb.findById(commentId)
    }
}

module.exports = { buildGetCommentByid }