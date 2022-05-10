function buildDeletePostById({ postsDb, AppError }) {
    return async function deletePostById({ postId }) {

        if (!Id.isValid(postId)) {
            throw new AppError("Can't delete post by invalid id.")
        }

        await postsDb.deleteById(postId)
    }
}

module.exports = { buildDeletePostById }