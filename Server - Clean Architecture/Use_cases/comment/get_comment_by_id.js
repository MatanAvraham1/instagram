export function buildGetCommentByid({ commentsDb }) {
    return async function getUserById({ commentId }) {
        return await commentsDb.findById(commentId)
    }
}