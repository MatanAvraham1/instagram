export function buildGetPostByid({ postsDb }) {
    return async function getUserById({ postId }) {
        return await postsDb.findById(postId)
    }
}