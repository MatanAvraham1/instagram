const { PostsDB } = require("../../Adapters/DB/posts_db")
const { UsersDB } = require("../../Adapters/DB/users_db")
const { CommentsDB } = require("../../Adapters/DB/comments_db")

const { AppError } = require("../../app_error")
const { Id } = require("../../CustomHelpers/Id_helper")
const { TextChecker } = require("../../CustomHelpers/Text_checker")
const { buildMakeComment } = require("./comment_entity")

const makeComment = buildMakeComment({ Id, TextChecker, AppError, UsersDB, PostsDB, CommentsDB })

module.exports = { makeComment }