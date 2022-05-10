const { makeStory } = require("../../Entities/story")

function buildAddStory({ storiesDb }) {
    return async function addStory({ publisherId, structure }) {
        const story = makeStory({ publisherId, structure })

        await storiesDb.insert(story)
        return story.id
    }
}

module.exports = { buildAddStory }