function buildLikeStory({ UsersDB, StoriesDB, Id, AppError, AppErrorMessages }) {
    return async function likeStory({ storyId, likerId }) {

        if (!Id.isValid(likerId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        if (!Id.isValid(storyId)) {
            throw new AppError(AppErrorMessages.invalidStoryId)
        }

        if (!(await UsersDB.doesUserExist(likerId))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        if (!(await StoriesDB.doesStoryExist(storyId))) {
            throw new AppError(AppErrorMessages.storyDoesNotExist)
        }

        return await StoriesDB.likeStory(storyId, likerId)
    }
}

module.exports = { buildLikeStory }