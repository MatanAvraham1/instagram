function buildGetUserByid({ UsersDB, Id, AppError }) {
    return async function getUserById({ userId }) {

        if (!Id.isValid(userId)) {
            throw new AppError("Can't get user by invalid id.")
        }

        return await UsersDB.findById(userId)
    }
}

module.exports = { buildGetUserByid }