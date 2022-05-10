const jwt = require('jsonwebtoken')
const { UsersDB } = require('../Adapters/DB/users_db')
const { AppError } = require('../app_error')


class AuthenticationService {
    static generateToken(object) {
        return jwt.sign(object, process.env.TOKEN_SECRET, { expiresIn: '2h' })
    }

    static authenticateToken(token) {

        let objectToReturn

        jwt.verify(token, process.env.TOKEN_SECRET, (err, object) => {

            if (err) {
                throw new AppError("Invalid jwt.")
            }


            objectToReturn = object
        })

        return objectToReturn
    }

    static async hasPermission(firstUserId, secondUserId) {
        // Checks if the first user has permission to look about private things of second user (like posts etc..)


        const user = await UsersDB.findById(secondUserId)
        if (!user.isPrivate) {
            return true
        }

        const isFollow = await UsersDB.isFollow(firstUserId, secondUserId)
        return isFollow
    }
}

// const Authentication = {
//     generateToken: (object) => {
//         return jwt.sign(object, process.env.TOKEN_SECRET, { expiresIn: '2h' })
//     },

//     authenticateToken: (token) => {

//         let objectToReturn

//         jwt.verify(token, process.env.TOKEN_SECRET, (err, object) => {

//             if (err) {
//                 throw new Error("Invalid jwt.")
//             }

//             objectToReturn = object
//         })

//         return objectToReturn
//     },
// }
module.exports = { AuthenticationService }