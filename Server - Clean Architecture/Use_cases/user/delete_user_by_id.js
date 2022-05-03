export function buildDeleteUserById({ usersDb }) {
    return async function deleteUserById({ userId }) {
        await usersDb.deleteById(userId)
    }
}