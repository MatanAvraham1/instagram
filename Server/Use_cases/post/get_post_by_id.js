function buildGetPostByid({ PostsDB, Id, AppError, AppErrorMessages }) {
    return async function getUserById({ postId }) {

        if (!Id.isValid(postId)) {
            throw new AppError(AppErrorMessages.invalidPostId)
        }

        if (!(await PostsDB.doesPostExist(postId))) {
            throw new AppError(AppErrorMessages.postDoesNotExist)
        }

        return await PostsDB.findById(postId)
    }
}

module.exports = { buildGetPostByid }