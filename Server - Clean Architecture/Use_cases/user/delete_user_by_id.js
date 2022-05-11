function buildDeleteUserById({ UsersDB, Id, AppError }) {
    return async function deleteUserById({ userId }) {

        if (!Id.isValid(userId)) {
            throw new AppError("Can't delete user by invalid id.")
        }

        if (!(await UsersDB.doesUserExist(userId))) {
            throw new AppError("User doesn't exist.")
        }

        await UsersDB.deleteById(userId)
    }
}

module.exports = { buildDeleteUserById }