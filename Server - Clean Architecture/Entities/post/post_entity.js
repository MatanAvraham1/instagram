function buildMakePost({ Id, PhotosChecker, TextChecker, AppError }) {
    return function makePost({ publisherId, taggedUsers, photos, publisherComment }) {


        if (!Id.isValid(publisherId)) {
            throw new AppError('Post must have valid publisher id.')
        }

        for (const taggedUser of taggedUsers) {
            if (!Id.isValid(taggedUser)) {
                throw new AppError('Post must have valid tagged users.')
            }
        }


        for (const photo of photos) {
            if (!PhotosChecker.isValid(photo)) {
                throw new AppError('Post must have valid photos.')
            }
        }


        if (!TextChecker.checkValidate(publisherComment)) {
            throw new AppError('Post must have valid publisher comment.')
        }

        return Object.freeze({
            publisherId: publisherId,
            taggedUsers: taggedUsers,
            photos: photos,
            id: Id.generate(),
            createdAt: Date.now(),
        })

    }
}

module.exports = { buildMakePost }