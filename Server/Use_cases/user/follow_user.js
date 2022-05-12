function buildFollowUser({ UsersDB, Id, AppError }) {
    return async function followUser({ firstUserId, secondUserId }) {

        // makes the first user to follow the second user

        if (!Id.isValid(firstUserId)) {
            throw new AppError("Can't follow user by invalid id (${firstUserId}).")
        }
        if (!Id.isValid(secondUserId)) {
            throw new AppError("Can't follow user by invalid id (${secondUserId}).")
        }

        if (firstUserId == secondUserId) {
            throw new AppError("User can't follow himself.")
        }

        if (!(await UsersDB.doesUserExist(firstUserId))) {
            throw new AppError("User (${firstUserId}) doesn't exist.")
        }

        if (!(await UsersDB.doesUserExist(secondUserId))) {
            throw new AppError("User (${secondUserId}) doesn't exist.")
        }

        await UsersDB.followUser(firstUserId, secondUserId)
    }
}

module.exports = { buildFollowUser }