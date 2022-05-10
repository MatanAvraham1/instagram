function buildUpdateFields({ UsersDB, Id, Username, Fullname, Bio, AppError }) {
    return async function updateFields({ userId, newUsername = undefined, newFullname = undefined, newBio = undefined, newIsPrivate = undefined }) {

        // makes the first user to unfollow the second user

        if (!Id.isValid(userId)) {
            throw new AppError("Can't update fields of user by invalid id.")
        }

        if (newUsername != undefined) {
            if (!Username.isValid(newUsername)) {
                throw new AppError("Can't update fields when username is invalid.")
            }
        }

        if (newFullname != undefined) {
            if (!Fullname.isValid(newFullname)) {
                throw new AppError("Can't update fields when fullname is invalid.")
            }
        }

        if (newBio != undefined) {
            if (!Bio.isValid(newBio)) {
                throw new AppError("Can't update fields when bio is invalid.")
            }
        }

        if (newIsPrivate != undefined) {
            if (typeof newIsPrivate != "boolean") {
                throw new AppError("Can't update fields when isPrivate is invalid.")
            }
        }

        await UsersDB.updateFields(userId, newUsername, newFullname, newBio, newIsPrivate)
    }
}

module.exports = { buildUpdateFields }