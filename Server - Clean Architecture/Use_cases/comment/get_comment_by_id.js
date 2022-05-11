function buildGetCommentByid({ CommentsDB, Id, AppError }) {
    return async function getUserById({ commentId }) {


        if (!Id.isValid(commentId)) {
            throw new AppError("Can't get comment by invalid id.")
        }

        if (!(await CommentsDB.doesCommentExist(commentId))) {
            throw new AppError("Comment doesn't exist.")
        }

        return await CommentsDB.findById(commentId)
    }
}

module.exports = { buildGetCommentByid }