export function buildGetStoryByid({ storiesDb }) {
    return async function getUserById({ storyId }) {
        return await storiesDb.findById(storyId)
    }
}