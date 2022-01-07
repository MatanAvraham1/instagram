const { userModel, doesUsernameAlreadyUse, createUser, userErrors, login } = require('../models/User')
const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const authRouter = express.Router()
const { errorCodes } = require('../errorCodes')


function generateToken(userId) {
    return jwt.sign({ userId: userId }, process.env.TOKEN_SECRET, { expiresIn: '2h' })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (authHeader != null) {
        const token = authHeader.split(' ')[1]

        if (jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

            if (err) {
                return res.sendStatus(403)
            }

            req.userId = user.userId
            next()
        })) {

        }
    }
    else {
        return res.sendStatus(403)
    }
}


authRouter.post('/register', async (req, res) => {
    try {
        const userId = await createUser(req.body)
        const token = generateToken(userId)
        return res.status(200).json({ jwt: token, userId: userId })
    }
    catch (err) {
        if (err == userErrors.usernameAlreadyUsedError) {
            return res.status(400).json({ codeError: errorCodes.usernameAlreadyUsed })
        }
        if (err == userErrors.invalidRegisterDetailsError) {
            return res.status(400).json({ codeError: errorCodes.invalidUsernameOrPassword })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        var userId = await login(req.body)
        const token = generateToken(userId)
        return res.status(200).json({ jwt: token, userId: userId })
    }
    catch (err) {
        if (err == userErrors.wrongLoginDetailsError) {
            return res.status(400).json({ codeError: errorCodes.wrongUsernameOrPassword })
        }

        console.log(err)
        return res.sendStatus(500)
    }

})

module.exports = { authRouter, authenticateToken }