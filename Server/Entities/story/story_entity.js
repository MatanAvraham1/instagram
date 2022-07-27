function buildMakeStory({ Id, PhotosChecker, StoryWidgetChecker, AppError, AppErrorMessages, UsersDB }) {
    return async function makeStory({ publisherId, photo, widgets }) {


        if (!Id.isValid(publisherId)) {
            throw new AppError(AppErrorMessages.invalidPublisherId)
        }

        if (!(await UsersDB.doesUserExist({ userId: publisherId }))) {
            throw new AppError(AppErrorMessages.publisherDoesNotExist)
        }

        if (!PhotosChecker.isValid(photo)) {
            throw new AppError(AppErrorMessages.InvalidPhoto)
        }

        if (!Array.isArray(taggedUsers)) {
            throw new AppError(AppErrorMessages.invalidWidget)
        }
        for (const widget of widgets) {
            if (!StoryWidgetChecker.isValid(widget)) {
                throw new AppError(AppErrorMessages.invalidWidget)
            }
        }

        return Object.freeze({
            photo: photo,
            widgets: widgets,
            publisherId: publisherId,
            id: Id.generate(),

            likes: 0,
            viewers: 0,

            createdAt: Date.now(),
        })

    }
}

module.exports = { buildMakeStory }