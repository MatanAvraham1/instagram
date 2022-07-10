function buildGetUserByUsername({ UsersDB, Username, AppError, AppErrorMessages }) {
    return async function getUserByUsername({ username }) {

        if (!Username.isValid(username)) {
            throw new AppError(AppErrorMessages.invalidUsername)
        }

        // NOTE: i can check if the user exists in the UsersDB, but here it more right for the clean artitecture... (becuase if i will change db it will be more clean)
        if (!(await UsersDB.doesUserExist({ username: username }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        return await UsersDB.findByUsername(username)
    }
}

module.exports = { buildGetUserByUsername }