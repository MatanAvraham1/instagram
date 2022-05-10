function buildDeleteUserById({ UsersDB, Id, AppError }) {
    return async function deleteUserById({ userId }) {

        if (!Id.isValid(userId)) {
            throw new AppError("Can't delete user by invalid id.")
        }

        await UsersDB.deleteById(userId)
    }
}

module.exports = { buildDeleteUserById }