function buildGetFollowers({ UsersDB, Id, AppError }) {
    return async function getFollowers({ userId, startIndex }) {

        if (!Id.isValid(userId)) {
            throw new AppError("Can't get followers of user by invalid id.")
        }

        return await UsersDB.getFollowers(userId, startIndex, 30)
    }
}

module.exports = { buildGetFollowers }