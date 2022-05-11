const { makeStory } = require("../../Entities/story")

function buildAddStory({ StoriesDB }) {
    return async function addStory({ publisherId, structure }) {
        const story = makeStory({ publisherId, structure })

        await StoriesDB.insert(story)
        return story.id
    }
}

module.exports = { buildAddStory }