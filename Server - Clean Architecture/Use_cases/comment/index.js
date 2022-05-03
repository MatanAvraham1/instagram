import { commentsDb } from "../../Adapters/DB/comments_db";
import { buildAddComment } from "./add_comment"
import { buildDeleteCommentById } from "./delete_comment_by_id"
import { buildGetCommentByid } from "./get_comment_by_id"

export const addComment = buildAddComment({ commentsDb })
export const deleteCommentById = buildDeleteCommentById({ commentsDb })
export const getCommentById = buildGetCommentByid({ commentsDb })