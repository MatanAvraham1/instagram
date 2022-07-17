function buildMakePost({ Id, Location, PhotosChecker, TextChecker, AppError, AppErrorMessages, UsersDB }) {
    return async function makePost({ publisherId, photos, publisherComment = null, location = null, taggedUsers = [] }) {


        if (!Id.isValid(publisherId)) {
            throw new AppError(AppErrorMessages.invalidPublisherId)
        }

        if (!(await UsersDB.doesUserExist({ userId: publisherId }))) {
            throw new AppError(AppErrorMessages.publisherDoesNotExist)
        }

        if (!Location.isValid(location)) {
            throw new AppError(AppErrorMessages.invalidLocation)
        }

        for (const taggedUser of taggedUsers) {
            if (!Id.isValid(taggedUser)) {
                throw new AppError(AppErrorMessages.invalidTaggedUser)
            }

            if (!(await UsersDB.doesUserExist({ userId: taggedUser }))) {
                throw new AppError(AppErrorMessages.unexistTaggedUser)
            }
        }


        for (const photo of photos) {
            if (!PhotosChecker.isValid(photo)) {
                throw new AppError(AppErrorMessages.InvalidPhoto)
            }
        }


        if (publisherComment != null) {
            if (!TextChecker.isValid(publisherComment)) {
                throw new AppError(AppErrorMessages.invalidPublisherComment)
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