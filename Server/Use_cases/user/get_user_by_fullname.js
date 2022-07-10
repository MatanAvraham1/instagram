function buildGetUserByFullname({ UsersDB, Fullname, AppError, AppErrorMessages }) {
    return async function getUserByFullname({ fullname }) {

        if (!Fullname.isValid(fullname)) {
            throw new AppError(AppErrorMessages.invalidFullname)
        }

        // NOTE: i can check if the user exists in the UsersDB, but here it more right for the clean artitecture... (becuase if i will change db it will be more clean)
        if (!(await UsersDB.doesUserExist({ fullname: fullname }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        return await UsersDB.findByFullname(fullname)
    }
}

module.exports = { buildGetUserByFullname }