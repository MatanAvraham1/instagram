function buildViewStory({ UsersDB, StoriesDB, Id, AppError }) {
    return async function viewStory({ storyId, viewerId }) {

        if (!Id.isValid(viewerId)) {
            throw new AppError("Can't view story by invalid user id.")
        }

        if (!Id.isValid(storyId)) {
            throw new AppError("Can't view story by invalid story id.")
        }

        if (!(await UsersDB.doesUserExist(viewerId))) {
            throw new AppError("User doesn't exist.")
        }

        if (!(await StoriesDB.doesStoryExist(storyId))) {
            throw new AppError("Story doesn't exist.")
        }

        return await StoriesDB.viewStory(storyId, viewerId)
    }
}

module.exports = { buildViewStory }