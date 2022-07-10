function buildUnviewStory({ UsersDB, StoriesDB, Id, AppError, AppErrorMessages }) {
    return async function unviewStoryById({ storyId, viewerId }) {

        if (!Id.isValid(viewerId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        if (!Id.isValid(storyId)) {
            throw new AppError(AppErrorMessages.invalidStoryId)
        }

        if (!(await UsersDB.doesUserExist({ userId: viewerId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        if (!(await StoriesDB.doesStoryExist(storyId))) {
            throw new AppError(AppErrorMessages.storyDoesNotExist)
        }

        return await StoriesDB.unviewStory(storyId, viewerId)
    }
}

module.exports = { buildUnviewStory }