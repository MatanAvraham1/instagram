function buildLikeStoryById({ UsersDB, StoriesDB, Id, AppError }) {
    return async function likeStoryById({ storyId, likerId }) {

        if (!Id.isValid(likerId)) {
            throw new AppError("Can't like story by invalid user id.")
        }

        if (!Id.isValid(storyId)) {
            throw new AppError("Can't like story by invalid story id.")
        }

        if (!(await UsersDB.doesUserExist(likerId))) {
            throw new AppError("User doesn't exist.")
        }

        if (!(await StoriesDB.doesStoryExist(storyId))) {
            throw new AppError("Story doesn't exist.")
        }

        return await StoriesDB.likeStory(storyId, likerId)
    }
}

module.exports = { buildLikeStoryById }