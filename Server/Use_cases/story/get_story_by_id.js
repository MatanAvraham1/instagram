function buildGetStoryByid({ StoriesDB, Id, AppError, AppErrorMessages }) {
    return async function getUserById({ storyId }) {

        if (!Id.isValid(storyId)) {
            throw new AppError(AppErrorMessages.invalidStoryId)
        }

        if (!(await StoriesDB.doesStoryExist(storyId))) {
            throw new AppError(AppErrorMessages.storyDoesNotExist)
        }

        return await StoriesDB.findById(storyId)
    }
}

module.exports = { buildGetStoryByid }