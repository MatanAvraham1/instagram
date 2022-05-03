export function buildMakeUser({ Id, Password, Username }) {
    return function makeUser({ username, password }) {


        let response = Username.isValid(username)
        if (!response.success) {
            throw new Error("User must have valid username :" + response.error)
        }

        response = Password.isValid(password)
        if (!response.success) {
            throw new Error("User must have valid password :" + response.error)
        }

        return Object.freeze({
            username: username,
            password: Password.hash(password),
            id: Id.generate(),
            createdOn: Date.now(),
        })

    }
}