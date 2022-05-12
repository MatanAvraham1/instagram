function makeRegister({ addUser, AuthenticationService }) {
    return async function register({ username, password }) {
        const createdUserId = await addUser({ username, password })
        const createdToken = AuthenticationService.generateToken({ userId: createdUserId })

        return { createdUserId, createdToken }
    }
}

module.exports = { makeRegister }