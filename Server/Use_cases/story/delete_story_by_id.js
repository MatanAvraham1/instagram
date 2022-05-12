function buildDeleteStoryById({ StoriesDB, Id, AppError }) {
    return async function deleteStoryById({ storyId }) {

        if (!Id.isValid(storyId)) {
            throw new AppError("Can't delete story by invalid id.")
        }

        if (!(await StoriesDB.doesStoryExist(storyId))) {
            throw new AppError("Story doesn't exist.")
        }

        await StoriesDB.deleteById(storyId)
    }
}

module.exports = { buildDeleteStoryById }