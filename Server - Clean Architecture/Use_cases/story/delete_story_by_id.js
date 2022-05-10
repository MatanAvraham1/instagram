function buildDeleteStoryById({ storiesDb, Id, AppError }) {
    return async function deleteStoryById({ storyId }) {

        if (!Id.isValid(storyId)) {
            throw new AppError("Can't delete story by invalid id.")
        }

        await storiesDb.deleteById(storyId)
    }
}

module.exports = { buildDeleteStoryById }