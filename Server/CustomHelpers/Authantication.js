const jwt = require('jsonwebtoken')
const { AppError, AppErrorMessages } = require('../app_error')
const { getUserById, isFollow } = require('../Use_cases/user')


class AuthenticationService {
    static generateToken(object) {
        return jwt.sign(object, process.env.TOKEN_SECRET, { expiresIn: '2h' })
    }

    static authenticateToken(token) {

        let objectToReturn

        jwt.verify(token, process.env.TOKEN_SECRET, (err, object) => {

            if (err) {
                throw new AppError(AppErrorMessages.invalidJwt)
            }


            objectToReturn = object
        })

        return objectToReturn
    }

    static async hasPermission(firstUserId, secondUserId) {
        // Checks if the first user has permission to look about private things of second user (like posts etc..)

        if (firstUserId == secondUserId) {
            return true
        }

        const user = await getUserById({ userId: secondUserId })
        if (!user.isPrivate) {
            return true
        }

        const _isFollow = await isFollow({ firstUserId, secondUserId })
        return _isFollow
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