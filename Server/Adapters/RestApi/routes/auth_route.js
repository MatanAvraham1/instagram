const { register, login } = require('../../../Use_cases/auth')

const Joi = require('joi');
const express = require('express');
const { AppError, AppErrorMessages } = require('../../../app_error');
const authRouter = express.Router()

const authFormObject = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
    // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})

function checkAuthFormObject(req, res, next) {


    const { error, value } = authFormObject.validate(req.body)
    if (error) {
        return res.sendStatus(400)
    }
    else {
        next()
    }
}

authRouter.post('/register', checkAuthFormObject, (req, res) => {

    const username = req.body.username
    const password = req.body.password

    register({ username, password }).then((value) => {
        res.status(201).json({ userId: value.createdUserId, jwt: value.createdToken })
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
}
)

authRouter.post('/login', checkAuthFormObject, (req, res) => {

    const username = req.body.username
    const password = req.body.password

    login({ username, password }).then((value) => {
        res.status(200).json({ userId: value.userId, jwt: value.token })
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.wrongLoginDetails) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

module.exports = { authRouter }