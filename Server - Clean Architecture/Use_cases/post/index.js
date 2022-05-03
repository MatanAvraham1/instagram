import { postsDb } from "../../Adapters/DB/posts_db";
import { buildAddPost } from "./add_post"
import { buildDeletePostById } from "./delete_post_by_id"
import { buildGetPostByid } from "./get_post_by_id"

export const addPost = buildAddPost({ postsDb })
export const deletePostById = buildDeletePostById({ postsDb })
export const getPostById = buildGetPostByid({ postsDb })