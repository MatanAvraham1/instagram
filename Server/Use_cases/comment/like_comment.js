function buildLikeCommentById({ UsersDB, CommentsDB, Id, AppError }) {
    return async function likeCommentById({ commentId, likerId }) {

        if (!Id.isValid(likerId)) {
            throw new AppError("Can't like comment by invalid user id.")
        }

        if (!Id.isValid(commentId)) {
            throw new AppError("Can't like comment by invalid comment id.")
        }

        if (!(await UsersDB.doesUserExist(likerId))) {
            throw new AppError("User doesn't exist.")
        }

        if (!(await CommentsDB.doesCommentExist(commentId))) {
            throw new AppError("Comment doesn't exist.")
        }

        return await CommentsDB.likeComment(commentId, likerId)
    }
}

module.exports = { buildLikeCommentById }