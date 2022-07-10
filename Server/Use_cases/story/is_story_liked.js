function buildisStoryLiked({ UsersDB, StoriesDB, Id, AppError, AppErrorMessages }) {
    return async function isStoryLiked({ storyId, likerId }) {

        // checks if user [likerId] likes the story [storyId]

        if (!Id.isValid(likerId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        if (!Id.isValid(storyId)) {
            throw new AppError(AppErrorMessages.invalidStoryId)
        }

        if (!(await UsersDB.doesUserExist({ userId: likerId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        if (!(await StoriesDB.doesStoryExist(storyId))) {
            throw new AppError(AppErrorMessages.storyDoesNotExist)
        }

        await StoriesDB.isLiked(storyId, likerId)
    }
}

module.exports = { buildisStoryLiked }