import { makeComment } from "../../Entities/comment"

export function buildAddComment({ commentsDb }) {
    return async function addComment({ publisherId, structure }) {
        const comment = makeComment({ publisherId, structure })

        await commentsDb.insert(comment)
    }
}