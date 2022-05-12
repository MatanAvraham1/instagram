const { buildMakeUser } = require('./user_entity')
const { Id } = require("../../CustomHelpers/Id_helper")
const { Password } = require("../../CustomHelpers/Password_helper")
const { Username } = require("../../CustomHelpers/Username_helper")
const { AppError } = require('../../app_error')

const makeUser = buildMakeUser({ Id, Password, Username, AppError })

module.exports = { makeUser }