export function buildMakeComment({ Id, TextChecker }) {
    return function makeComment({ publisherId, postId, comment }) {

        if (!Id.isValid(publisherId)) {
            throw new Error("Comment must have valid publisherId.")
        }

        if (!Id.isValid(postId)) {
            throw new Error("Comment must have valid postId.")
        }

        if (!TextChecker.isValid(comment)) {
            throw new Error("Comment must have valid comment.")
        }

        return Object.freeze({
            publisherId: publisherId,
            postId: postId,
            comment: comment,
            id: Id.generate(),
            createdOn: Date.now(),
        })

    }
}