function buildUnlikeStory({ UsersDB, StoriesDB, Id, AppError, AppErrorMessages }) {
    return async function unlikeStory({ storyId, likerId }) {

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

        if (!(await StoriesDB.isLiked(storyId, likerId))) {
            throw new AppError(AppErrorMessages.alreadyUnliked)
        }

        return await StoriesDB.unlikeStory(storyId, likerId)
    }
}

module.exports = { buildUnlikeStory }