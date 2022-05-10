const { AppError } = require("../../app_error")
const { Id } = require("../../CustomHelpers/Id_helper")
const { TextChecker } = require("../../CustomHelpers/Text_checker")
const { buildMakeComment } = require("./comment_entity")

const makeComment = buildMakeComment({ Id, TextChecker, AppError })

module.exports = { makeComment }