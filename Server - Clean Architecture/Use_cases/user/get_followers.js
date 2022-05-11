function buildGetFollowers({ UsersDB, Id, AppError }) {
    return async function getFollowers({ userId, startIndex }) {

        if (!Id.isValid(userId)) {
            throw new AppError("Can't get followers of user by invalid id.")
        }

        // NOTE: i can check if the user exists in the UsersDB, but here it more right for the clean artitecture... (becuase if i will change db it will be more clean)
        if (!(await UsersDB.doesUserExist(userId))) {
            throw new AppError("User doesn't exist.")
        }

        return await UsersDB.getFollowers(userId, startIndex, 30)
    }
}

module.exports = { buildGetFollowers }