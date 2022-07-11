function buildGetPostsByPublisherId({ UsersDB, PostsDB, Id, AppError, AppErrorMessages }) {
    return async function getPostsByPublisherId({ publisherId, startFromIndex }) {

        if (!Id.isValid(publisherId)) {
            throw new AppError(AppErrorMessages.invalidPublisherId)
        }

        if (!(await UsersDB.doesUserExist({ userId: publisherId }))) {
            throw new AppError(AppErrorMessages.publisherDoesNotExist)
        }

        return await PostsDB.findByPublisher(publisherId, startFromIndex, 10)
    }
}

module.exports = { buildGetPostsByPublisherId }