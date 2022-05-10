const { PostsDB } = require("../../Adapters/DB/posts_db")
const { buildAddPost } = require("./add_post")
const { buildDeletePostById } = require("./delete_post_by_id")
const { buildGetPostByid } = require("./get_post_by_id")
const { Id } = require("../../CustomHelpers/Id_helper")
const { AppError } = require("../../app_error")
const { buildGetPostsByPublisherId } = require("./get_posts_by_publisher_id")

const addPost = buildAddPost({ PostsDB })
const deletePostById = buildDeletePostById({ PostsDB, Id, AppError })
const getPostById = buildGetPostByid({ PostsDB, Id, AppError })
const getPostsByPublisherId = buildGetPostsByPublisherId({ PostsDB, Id, AppError })

module.exports = { addPost, deletePostById, getPostById, getPostsByPublisherId }