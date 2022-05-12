function buildGetUserByid({ UsersDB, Id, AppError }) {
    return async function getUserById({ userId }) {

        if (!Id.isValid(userId)) {
            throw new AppError("Can't get user by invalid id.")
        }

        // NOTE: i can check if the user exists in the UsersDB, but here it more right for the clean artitecture... (becuase if i will change db it will be more clean)
        if (!(await UsersDB.doesUserExist(userId))) {
            throw new AppError("User doesn't exist.")
        }

        return await UsersDB.findById(userId)
    }
}

module.exports = { buildGetUserByid }