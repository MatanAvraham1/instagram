export function buildDeletePostById({ postsDb }) {
    return async function deletePostById({ postId }) {
        await postsDb.deleteById(postId)
    }
}