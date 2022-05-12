function buildGetCommentsByPublisherId({ UsersDB, CommentsDB, Id, AppError }) {
    return async function getCommentsByPublisherId({ publisherId, startFromIndex }) {

        if (!Id.isValid(publisherId)) {
            throw new AppError(AppErrorMessages.invalidPublisherId)
        }

        if (!(await UsersDB.doesUserExist(publisherId))) {
            throw new AppError(AppErrorMessages.publisherDoesNotExist)
        }

        return await CommentsDB.findByPublisherId(publisherId, startFromIndex, 30)
    }
}

module.exports = { buildGetCommentsByPublisherId }