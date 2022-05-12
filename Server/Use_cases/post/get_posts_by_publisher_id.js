function buildGetPostsByPublisherId({ UsersDB, PostsDB, Id, AppError }) {
    return async function getPostsByPublisherId({ startFromIndex, publisherId }) {

        if (!Id.isValid(publisherId)) {
            throw new AppError("Can't get posts by invalid publisher id.")
        }

        if (!(await UsersDB.doesUserExist(publisherId))) {
            throw new AppError("Post publisher doesn't exist.")
        }

        return await PostsDB.findByPublisher(publisherId, startFromIndex, 10)
    }
}

module.exports = { buildGetPostsByPublisherId }