import { makePost } from "../../Entities/post"

export function buildAddPost({ postsDb }) {
    return async function addPost({ publisherId, structure }) {
        const post = makePost({ publisherId, structure })

        await postsDb.insert(post)
    }
}