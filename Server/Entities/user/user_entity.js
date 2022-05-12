function buildMakeUser({ Id, Password, Username, AppError }) {
    return async function makeUser({ username, password }) {


        if (!Username.isValid(username)) {
            throw new AppError('User must have valid username.')
        }

        if (!await Username.isUsed(username)) {
            throw new AppError('User must have unused username.')
        }

        if (!Username.isValid(username)) {
            throw new AppError('User must have valid password.')
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