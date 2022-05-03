export function buildMakePost({ Id, PhotosChecker, TextChecker }) {
    return function makePost({ publisherId, taggedUsers, photos, publisherComment }) {

        if (!Id.isValid(publisherId)) {
            throw new Error("Post must have valid publisherId.")
        }

        for (const taggedUser of taggedUsers) {
            if (!Id.isValid(taggedUser)) {
                throw new Error('Post must have valid taggedUsers.')
            }
        }

        for (const photo of photos) {
            if (!PhotosChecker.isValid(photo)) {
                throw new Error('Post must have valid photos.')
            }
        }

        if (!TextChecker.isValid(comment)) {
            throw new Error("Post must have valid comment.")
        }

        return Object.freeze({
            publisherId: publisherId,
            taggedUsers: taggedUsers,
            photos: photos,
            id: Id.generate(),
            createdOn: Date.now(),
        })

    }
}