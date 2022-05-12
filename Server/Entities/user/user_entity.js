function buildMakeUser({ Id, Password, Username, AppError, AppErrorMessages }) {
    return async function makeUser({ username, password }) {


        if (!Username.isValid(username)) {
            throw new AppError(AppErrorMessages.invalidUsername)
        }

        if (!await Username.isUsed(username)) {
            throw new AppError(AppErrorMessages.usedUsername)
        }

        if (!Password.isValid(username)) {
            throw new AppError(AppErrorMessages.InvalidPassword)
        }

        return Object.freeze({
            username: username,
            password: await Password.hash(password),
            id: Id.generate(),
            createdAt: Date.now(),

            fullname: null,
            bio: null,
            isPrivate: false,

            followers: 0,
            followings: 0,
            posts: 0,

            stories: 0,

            followRequests: 0,
            followingRequests: 0,
        })

    }
}

module.exports = { buildMakeUser }