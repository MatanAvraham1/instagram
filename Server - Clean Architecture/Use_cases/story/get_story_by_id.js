function buildGetStoryByid({ storiesDb, Id, AppError }) {
    return async function getUserById({ storyId }) {

        if (!Id.isValid(storyId)) {
            throw new AppError("Can't get story by invalid id.")
        }

        return await storiesDb.findById(storyId)
    }
}

module.exports = { buildGetStoryByid }