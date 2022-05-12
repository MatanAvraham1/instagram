function buildGetPostsByPublisherId({ UsersDB, PostsDB, Id, AppError, AppErrorMessages }) {
    return async function getPostsByPublisherId({ startFromIndex, publisherId }) {

        if (!Id.isValid(publisherId)) {
            throw new AppError(AppErrorMessages.invalidPublisherId)
        }

        if (!(await UsersDB.doesUserExist(publisherId))) {
            throw new AppError(AppErrorMessages.publisherDoesNotExist)
        }

        return await PostsDB.findByPublisher(publisherId, startFromIndex, 10)
    }
}

module.exports = { buildGetPostsByPublisherId }