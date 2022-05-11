function buildGetStoriesByPublisherId({ UsersDB, StoriesDB, Id, AppError }) {
    return async function getStoriesByPublisherId({ publisherId, startFromIndex }) {

        if (!Id.isValid(publisherId)) {
            throw new AppError("Can't get stories by invalid publisher id.")
        }

        if (!(await UsersDB.doesUserExist(publisherId))) {
            throw new AppError("Story publisher doesn't exist.")
        }

        return await StoriesDB.findByPublisher(publisherId, startFromIndex, 10)
    }
}

module.exports = { buildGetStoriesByPublisherId }