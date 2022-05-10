function buildGetCommentByid({ CommentsDB, Id, AppError }) {
    return async function getUserById({ commentId }) {


        if (!Id.isValid(commentId)) {
            throw new AppError("Can't get comment by invalid id.")
        }

        return await CommentsDB.findById(commentId)
    }
}

module.exports = { buildGetCommentByid }