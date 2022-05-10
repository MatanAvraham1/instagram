const { makeUser } = require("../../Entities/user")

function buildAddUser({ UsersDB }) {
    return async function addUser({ username, password }) {
        const user = await makeUser({ username, password })

        await UsersDB.insert(user)
        return user.id
    }
}

module.exports = { buildAddUser }