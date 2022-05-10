const { AuthenticationService } = require('./CustomHelpers/AuthenticationService')

const token = AuthenticationService.generateToken({ userId: "asdsadsa" })
console.log(token)
const object = AuthenticationService.authenticateToken(token)
console.log(object)