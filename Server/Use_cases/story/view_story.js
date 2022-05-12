function buildViewStory({ UsersDB, StoriesDB, Id, AppError, AppErrorMessages }) {
    return async function viewStory({ storyId, viewerId }) {

        if (!Id.isValid(viewerId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        if (!Id.isValid(storyId)) {
            throw new AppError(AppErrorMessages.invalidStoryId)
        }

        if (!(await UsersDB.doesUserExist(viewerId))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        if (!(await StoriesDB.doesStoryExist(storyId))) {
            throw new AppError(AppErrorMessages.storyDoesNotExist)
        }

        return await StoriesDB.viewStory(storyId, viewerId)
    }
}

module.exports = { buildViewStory }