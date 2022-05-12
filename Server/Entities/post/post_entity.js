function buildMakePost({ Id, Location, PhotosChecker, TextChecker, AppError, UsersDB }) {
    return async function makePost({ publisherId, photos, publisherComment = null, location = null, taggedUsers = [] }) {


        if (!Id.isValid(publisherId)) {
            throw new AppError('Post must have valid publisher id.')
        }

        if (!(await UsersDB.doesUserExist(publisherId))) {
            throw new AppError('Post must have existing publisher.')
        }

        if (!Location.isValid(location)) {
            throw new AppError('Post must have valid location.')
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


        if (publisherComment != null) {
            if (!TextChecker.checkValidate(publisherComment)) {
                throw new AppError('Post must have valid publisher comment.')
            }
        }


        return Object.freeze({
            publisherId: publisherId,
            taggedUsers: taggedUsers,
            photos: photos,
            location: location,
            publisherComment: publisherComment,
            id: Id.generate(),
            createdAt: Date.now(),

            comments: 0,
            likes: 0,
        })

    }
}

module.exports = { buildMakePost }