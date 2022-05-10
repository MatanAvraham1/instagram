const { buildMakePost } = require("./post_entity")
const { Id } = require("../../CustomHelpers/Id_helper")
const { PhotosChecker } = require("../../CustomHelpers/Photos_checker")
const { TextChecker } = require("../../CustomHelpers/Text_checker")
const { AppError } = require("../../app_error")


const makePost = buildMakePost({ Id, PhotosChecker, TextChecker, AppError })

module.exports = { makePost }