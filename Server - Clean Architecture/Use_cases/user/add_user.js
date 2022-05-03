import { makeUser } from "../../Entities/user";

export function buildAddUser({ usersDb }) {
    return async function addUser({ username, password }) {
        const user = makeUser({ username, password })

        await usersDb.insert(user)
    }
}