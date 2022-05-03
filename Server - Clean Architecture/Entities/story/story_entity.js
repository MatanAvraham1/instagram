export function buildMakeStory({ Id, StoryStructure }) {
    return function makeStory({ publisherId, structure }) {


        if (!Id.isValid(publisherId)) {
            throw new Error("Story must have valid publisherId.")
        }

        const response = StoryStructure.valid(structure)
        if (!response.success) {
            throw new Error("Story must have valid structure: " + response.error)
        }

        return Object.freeze({
            structure: structure,
            publisherId: publisherId,
            id: Id.generate(),
            createdOn: Date.now(),
        })

    }
}