const { buildMakePost } = require("./post_entity")
const { Id } = require("../../CustomHelpers/Id_helper")
const { Location } = require("../../CustomHelpers/Location_helper")
const { PhotosChecker } = require("../../CustomHelpers/Photos_checker")
const { TextChecker } = require("../../CustomHelpers/Text_checker")
const { AppError } = require("../../app_error")
const { UsersDB } = require("../../Adapters/DB/users_db")

const makePost = buildMakePost({ Id, Location, PhotosChecker, TextChecker, AppError, UsersDB })

module.exports = { makePost }