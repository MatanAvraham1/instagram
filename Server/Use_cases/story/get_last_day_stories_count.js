function buildGetLastDayStoriesCount({ UsersDB, StoriesDB, Id, AppError, AppErrorMessages }) {
    return async function getLastDayStoriesCount({ publisherId }) {

        if (!Id.isValid(publisherId)) {
            throw new AppError(AppErrorMessages.invalidPublisherId)
        }

        if (!(await UsersDB.doesUserExist({ userId: publisherId }))) {
            throw new AppError(AppErrorMessages.publisherDoesNotExist)
        }

        return await StoriesDB.getLastDayStoriesCount(publisherId)
    }
}

module.exports = { buildGetLastDayStoriesCount }