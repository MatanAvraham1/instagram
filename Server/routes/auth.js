const { userModel, doesUserExist } = require('../models/User')
const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const authRouter = express.Router()
const { errorCodes } = require('../errorCodes')

function isRegisterValid(data) {
    const scheme = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    })
    const value = scheme.validate(data)

    if (value.error == null) {
        return true
    }

    return false
}
const isLoginValid = isRegisterValid;

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
        const isValid = isRegisterValid(req.body)
        if (isValid) {
            if (await doesUserExist(req.body.username)) {
                return res.status(400).send({ "errorCode": errorCodes.usernameAlreadyUsed })

            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = new userModel({ username: req.body.username, password: hashedPassword })
            const { _id } = await user.save()

            const token = generateToken(_id)
            res.status(200).json({ jwt: token, userId: _id })
        }
        else {
            return res.status(400).send({ "errorCode": errorCodes.invalidUsernameOrPassword })
        }
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const isValid = isLoginValid(req.body)
        if (isValid) {
            var user = await userModel.findOne({ username: req.body.username })
            if (!user) {
                return res.status(400).send({ "errorCode": errorCodes.wrongUsernameOrPassword })
            }

            if (await bcrypt.compare(req.body.password, user.password)) {
                const token = generateToken(user._id)
                return res.status(200).json({ jwt: token, userId: user._id })
            }

            return res.status(400).send({ "errorCode": errorCodes.wrongUsernameOrPassword })
        }
        else {
            return res.status(400).send({ "errorCode": errorCodes.wrongUsernameOrPassword })
        }
    }
    catch {
        console.log(err)
        res.sendStatus(500)
    }

})

module.exports = { authRouter, authenticateToken }