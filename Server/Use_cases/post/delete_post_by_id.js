function buildDeletePostById({ PostsDB, Id, AppError }) {
    return async function deletePostById({ postId }) {

        if (!Id.isValid(postId)) {
            throw new AppError("Can't delete post by invalid id.")
        }

        if (!(await PostsDB.doesPostExist(postId))) {
            throw new AppError("Post doesn't exist.")
        }

        await PostsDB.deleteById(postId)
    }
}

module.exports = { buildDeletePostById }