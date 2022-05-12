const { addUser } = require("../user/index")
const { makeLogin } = require("./login")
const { makeRegister } = require("./register")
const { AuthenticationService } = require('../../CustomHelpers/Authantication')
const { UsersDB } = require('../../Adapters/DB/users_db')
const { Username } = require('../../CustomHelpers/Username_helper')
const { Password } = require('../../CustomHelpers/Password_helper')
const { AppError, AppErrorMessages } = require("../../app_error")

const register = makeRegister({ addUser, AuthenticationService })
const login = makeLogin({ UsersDB, AuthenticationService, Username, Password, AppError, AppErrorMessages })

module.exports = { register, login }