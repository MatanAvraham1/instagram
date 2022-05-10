function buildGetPostByid({ postsDb, AppError }) {
    return async function getUserById({ postId }) {

        if (!Id.isValid(postId)) {
            throw new AppError("Can't get post by invalid id.")
        }

        return await postsDb.findById(postId)
    }
}

module.exports = { buildGetPostByid }