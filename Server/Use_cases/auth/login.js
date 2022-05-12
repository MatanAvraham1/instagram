function makeLogin({ UsersDB, AuthenticationService, Username, Password, AppError, AppErrorMessages }) {
    return async function login({ username, password }) {


        if (!Username.isValid(username)) {
            throw new AppError(AppErrorMessages.invalidUsername)
        }

        if (!Password.isValid(password)) {
            throw new AppError(AppErrorMessages.invalidPassword)
        }

        const userId = await UsersDB.checkLogin(username, password)

        if (userId) {
            return { userId: userId, token: AuthenticationService.generateToken({ userId }) }
        }
        else {
            throw new AppError(AppErrorMessages.wrongLoginDetails)
        }
    }
}

module.exports = { makeLogin }