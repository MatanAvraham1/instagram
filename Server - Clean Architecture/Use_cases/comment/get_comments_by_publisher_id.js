function buildGetCommentsByPublisherId({ UsersDB, CommentsDB, Id, AppError }) {
    return async function getCommentsByPublisherId({ publisherId, startFromIndex }) {

        if (!Id.isValid(publisherId)) {
            throw new AppError("Can't get comments by invalid publisher id.")
        }

        if (!(await UsersDB.doesUserExist(publisherId))) {
            throw new AppError("User doesn't exist.")
        }

        return await CommentsDB.findByPublisherId(publisherId, startFromIndex, 30)
    }
}

module.exports = { buildGetCommentsByPublisherId }