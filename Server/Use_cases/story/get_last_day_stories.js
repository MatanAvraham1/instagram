function buildGetLastDayStoriesByPublisherId({ UsersDB, StoriesDB, Id, AppError, AppErrorMessages }) {
    return async function getLastDayStoriesByPublisherId({ publisherId, startFromIndex }) {

        if (!Id.isValid(publisherId)) {
            throw new AppError(AppErrorMessages.invalidPublisherId)
        }

        if (!(await UsersDB.doesUserExist({ userId: publisherId }))) {
            throw new AppError(AppErrorMessages.publisherDoesNotExist)
        }

        return await StoriesDB.getLastDayStories(publisherId, startFromIndex, 100) // TODO: make a limit to the stories
    }
}

module.exports = { buildGetLastDayStoriesByPublisherId }