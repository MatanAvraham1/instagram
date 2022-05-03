import { makeStory } from "../../Entities/story"

export function buildAddStory({ storiesDb }) {
    return async function addStory({ publisherId, structure }) {
        const story = makeStory({ publisherId, structure })

        await storiesDb.insert(story)
    }
}