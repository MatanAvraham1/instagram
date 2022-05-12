function buildMakeStory({ Id, StoryStructure, AppError, AppErrorMessages, UsersDB }) {
    return async function makeStory({ publisherId, structure }) {


        if (!Id.isValid(publisherId)) {
            throw new AppError(AppErrorMessages.invalidPublisherId)
        }

        if (!(await UsersDB.doesUserExist(publisherId))) {
            throw new AppError(AppErrorMessages.publisherDoesNotExist)
        }

        if (!StoryStructure.isValid(structure)) {
            throw new AppError(AppErrorMessages.invalidStoryStructure)
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