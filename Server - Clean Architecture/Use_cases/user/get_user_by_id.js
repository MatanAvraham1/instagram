export function buildGetUserByid({ usersDb }) {
    return async function getUserById({ userId }) {
        return await usersDb.findById(userId)
    }
}