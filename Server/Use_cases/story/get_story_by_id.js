function buildGetStoryByid({ StoriesDB, Id, AppError }) {
    return async function getUserById({ storyId }) {

        if (!Id.isValid(storyId)) {
            throw new AppError("Can't get story by invalid id.")
        }

        if (!(await StoriesDB.doesStoryExist(storyId))) {
            throw new AppError("Story doesn't exist.")
        }

        return await StoriesDB.findById(storyId)
    }
}

module.exports = { buildGetStoryByid }