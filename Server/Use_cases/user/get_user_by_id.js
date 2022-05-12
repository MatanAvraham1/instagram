function buildGetUserByid({ UsersDB, Id, AppError, AppErrorMessages }) {
    return async function getUserById({ userId }) {

        if (!Id.isValid(userId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        // NOTE: i can check if the user exists in the UsersDB, but here it more right for the clean artitecture... (becuase if i will change db it will be more clean)
        if (!(await UsersDB.doesUserExist(userId))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        return await UsersDB.findById(userId)
    }
}

module.exports = { buildGetUserByid }