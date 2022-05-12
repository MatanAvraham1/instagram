function buildGetPostByid({ PostsDB, Id, AppError }) {
    return async function getUserById({ postId }) {

        if (!Id.isValid(postId)) {
            throw new AppError("Can't get post by invalid id.")
        }

        if (!(await PostsDB.doesPostExist(postId))) {
            throw new AppError("Post doesn't exist.")
        }

        return await PostsDB.findById(postId)
    }
}

module.exports = { buildGetPostByid }