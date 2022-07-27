function buildIsRequest({ UsersDB, Id, AppError, AppErrorMessages }) {
    return async function IsRequest({ firstUserId, secondUserId }) {

        // checks if first user requested second user

        if (!Id.isValid(firstUserId)) {
            throw new AppError(AppErrorMessages.invalidUserId, firstUserId)
        }
        if (!Id.isValid(secondUserId)) {
            throw new AppError(AppErrorMessages.invalidUserId, secondUserId)
        }

        if (firstUserId == secondUserId) {
            throw new AppError(AppErrorMessages.userCanNotFollowHimself)
        }

        if (!(await UsersDB.doesUserExist({ userId: firstUserId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist, firstUserId)
        }

        if (!(await UsersDB.doesUserExist({ userId: secondUserId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist, secondUserId)
        }

        return await UsersDB.isRequest(firstUserId, secondUserId)
    }
}

module.exports = { buildIsRequest }