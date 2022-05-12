function buildGetStoriesByPublisherId({ UsersDB, StoriesDB, Id, AppError, AppErrorMessages }) {
    return async function getStoriesByPublisherId({ publisherId, startFromIndex }) {

        if (!Id.isValid(publisherId)) {
            throw new AppError(AppErrorMessages.invalidPublisherId)
        }

        if (!(await UsersDB.doesUserExist(publisherId))) {
            throw new AppError(AppErrorMessages.publisherDoesNotExist)
        }

        return await StoriesDB.findByPublisher(publisherId, startFromIndex, 10)
    }
}

module.exports = { buildGetStoriesByPublisherId }