const { postsDb } = require("../../Adapters/DB/posts_db")
const { buildAddPost } = require("./add_post")
const { buildDeletePostById } = require("./delete_post_by_id")
const { buildGetPostByid } = require("./get_post_by_id")
const { Id } = require("../../CustomHelpers/Id_helper")
const { AppError } = require("../../app_error")

const addPost = buildAddPost({ postsDb })
const deletePostById = buildDeletePostById({ postsDb, Id, AppError })
const getPostById = buildGetPostByid({ postsDb, Id, AppError })

module.exports = { addPost, deletePostById, getPostById }