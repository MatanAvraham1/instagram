const { commentsDb } = require("../../Adapters/DB/comments_db")
const { buildAddComment } = require("./add_comment")
const { buildDeleteCommentById } = require("./delete_comment_by_id")
const { buildGetCommentByid } = require("./get_comment_by_id")
const { Id } = require("../../CustomHelpers/Id_helper")
const { AppError } = require("../../app_error")

const addComment = buildAddComment({ commentsDb })
const deleteCommentById = buildDeleteCommentById({ commentsDb, Id, AppError })
const getCommentById = buildGetCommentByid({ commentsDb, Id, AppError })

module.exports = { addComment, deleteCommentById, getCommentById }