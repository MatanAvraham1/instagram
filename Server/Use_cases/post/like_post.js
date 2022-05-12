function buildLikePost({ UsersDB, PostsDB, Id, AppError }) {
    return async function likePost({ postId, likerId }) {

        if (!Id.isValid(likerId)) {
            throw new AppError("Can't like post by invalid user id.")
        }

        if (!Id.isValid(postId)) {
            throw new AppError("Can't like post by invalid post id.")
        }

        if (!(await UsersDB.doesUserExist(likerId))) {
            throw new AppError("User doesn't exist.")
        }

        if (!(await PostsDB.doesPostExist(postId))) {
            throw new AppError("Post doesn't exist.")
        }

        return await PostsDB.likePost(postId, likerId)
    }
}

module.exports = { buildLikePost }