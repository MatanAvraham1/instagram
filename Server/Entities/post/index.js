const { buildMakePost } = require("./post_entity")
const { Id } = require("../../CustomHelpers/Id_helper")
const { Location } = require("../../CustomHelpers/Location_helper")
const { PhotosChecker } = require("../../CustomHelpers/Photos_checker")
const { TextChecker } = require("../../CustomHelpers/Text_checker")
const { AppError, AppErrorMessages } = require("../../app_error")
const { UsersDB } = require("../../Adapters/DB/users_db")
const { PostsDB } = require("../../Adapters/DB/posts_db")

const makePost = buildMakePost({ Id, Location, PhotosChecker, TextChecker, AppError, AppErrorMessages, UsersDB, PostsDB })

module.exports = { makePost }