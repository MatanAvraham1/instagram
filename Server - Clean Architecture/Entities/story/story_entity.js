function buildMakeStory({ Id, StoryStructure, AppError }) {
    return function makeStory({ publisherId, structure }) {


        if (!Id.isValid(publisherId)) {
            throw new AppError('Story must have valid publisher Id.')
        }

        if (!StoryStructure.isValid(structure)) {
            throw new AppError('Story must have valid story structure.')
        }

        return Object.freeze({
            structure: structure,
            publisherId: publisherId,
            id: Id.generate(),
            createdAt: Date.now(),
        })

    }
}

module.exports = { buildMakeStory }