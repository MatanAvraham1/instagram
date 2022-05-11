function buildMakeStory({ Id, StoryStructure, AppError, UsersDB }) {
    return function makeStory({ publisherId, structure }) {


        if (!Id.isValid(publisherId)) {
            throw new AppError('Story must have valid publisher Id.')
        }

        if (!(await UsersDB.doesUserExist(publisherId))) {
            throw new AppError('Story must have existing publisher.')
        }

        if (!StoryStructure.isValid(structure)) {
            throw new AppError('Story must have valid story structure.')
        }

        return Object.freeze({
            structure: structure,
            publisherId: publisherId,
            id: Id.generate(),

            likes: 0,
            viewers: 0,

            createdAt: Date.now(),
        })

    }
}

module.exports = { buildMakeStory }