const { PostsDB } = require("../../Adapters/DB/posts_db")
const { buildAddPost } = require("./add_post")
const { buildDeletePostById } = require("./delete_post_by_id")
const { buildGetPostByid } = require("./get_post_by_id")
const { Id } = require("../../CustomHelpers/Id_helper")
const { AppError, AppErrorMessages } = require("../../app_error")
const { buildGetPostsByPublisherId } = require("./get_posts_by_publisher_id")
const { UsersDB } = require("../../Adapters/DB/users_db")
const { buildLikePost } = require("./like_post")
const { buildUnlikePost } = require("./unlike_post")

const addPost = buildAddPost({ PostsDB })
const deletePostById = buildDeletePostById({ PostsDB, Id, AppError, AppErrorMessages })
const getPostById = buildGetPostByid({ PostsDB, Id, AppError, AppErrorMessages })
const getPostsByPublisherId = buildGetPostsByPublisherId({ UsersDB, PostsDB, Id, AppError, AppErrorMessages })
const likePost = buildLikePost({ UsersDB, PostsDB, Id, AppError, AppErrorMessages })
const unlikePost = buildUnlikePost({ UsersDB, PostsDB, Id, AppError, AppErrorMessages })

module.exports = { addPost, deletePostById, getPostById, getPostsByPublisherId, likePost, unlikePost }