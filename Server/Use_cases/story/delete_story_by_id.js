function buildDeleteStoryById({ StoriesDB, Id, AppError, AppErrorMessages }) {
    return async function deleteStoryById({ storyId }) {

        if (!Id.isValid(storyId)) {
            throw new AppError(AppErrorMessages.InvalidStoryId)
        }

        if (!(await StoriesDB.doesStoryExist(storyId))) {
            throw new AppError(AppErrorMessages.storyDoesNotExist)
        }

        await StoriesDB.deleteById(storyId)
    }
}

module.exports = { buildDeleteStoryById }