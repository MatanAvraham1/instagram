export function buildDeleteStoryById({ storiesDb }) {
    return async function deleteStoryById({ storyId }) {
        await storiesDb.deleteById(storyId)
    }
}