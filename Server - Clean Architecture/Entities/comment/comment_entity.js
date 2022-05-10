function buildMakeComment({ Id, TextChecker, AppError }) {
    return function makeComment({ publisherId, postId, comment }) {


        if (!Id.isValid(publisherId)) {
            throw new AppError('Comment must have valid publisher id.')
        }


        if (!Id.isValid(postId)) {
            throw new AppError('Comment must have valid post id.')
        }

        if (!TextChecker.checkValidate(comment)) {
            throw new AppError('Comment must have valid comment.')
        }

        return Object.freeze({
            publisherId: publisherId,
            postId: postId,
            comment: comment,
            id: Id.generate(),
            createdAt: Date.now(),
        })

    }
}

module.exports = { buildMakeComment }