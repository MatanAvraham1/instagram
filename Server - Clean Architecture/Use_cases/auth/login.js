function makeLogin({ UsersDB, AuthenticationService, Username, Password, AppError }) {
    return async function login({ username, password }) {


        if (!Username.isValid(username)) {
            throw new AppError("Can't check login of invalid username.")
        }

        if (!Password.isValid(password)) {
            throw new AppError("Can't check login of invalid password.")
        }

        const userId = await UsersDB.checkLogin(username, password)

        if (userId) {
            return { userId: userId, token: AuthenticationService.generateToken({ userId }) }
        }
        else {
            throw new AppError('Wrong username or password.')
        }
    }
}

module.exports = { makeLogin }