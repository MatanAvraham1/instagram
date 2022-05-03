export function buildDeleteCommentById({ commentsDb }) {
    return async function deleteCommentById({ commentId }) {
        await commentsDb.deleteById(commentId)
    }
}