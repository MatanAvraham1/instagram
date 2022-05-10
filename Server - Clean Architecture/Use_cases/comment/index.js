const { CommentsDB } = require("../../Adapters/DB/comments_db")
const { buildAddComment } = require("./add_comment")
const { buildDeleteCommentById } = require("./delete_comment_by_id")
const { buildGetCommentByid } = require("./get_comment_by_id")
const { Id } = require("../../CustomHelpers/Id_helper")
const { AppError } = require("../../app_error")
const { buildGetCommentsByPostId } = require("./get_comments_by_post_id")

const addComment = buildAddComment({ CommentsDB })
const deleteCommentById = buildDeleteCommentById({ CommentsDB, Id, AppError })
const getCommentById = buildGetCommentByid({ CommentsDB, Id, AppError })
const getCommentsByPostId = buildGetCommentsByPostId({ CommentsDB, Id, AppError })

module.exports = { addComment, deleteCommentById, getCommentById, getCommentsByPostId }