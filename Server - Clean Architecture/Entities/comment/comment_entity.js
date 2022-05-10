function buildMakeComment({ Id, TextChecker, AppError, UsersDB, PostsDB, CommentsDB }) {
    return function makeComment({ publisherId, postId, comment }) {


        if (!Id.isValid(publisherId)) {
            throw new AppError('Comment must have valid publisher id.')
        }

        if (!(await UsersDB.doesUserExist(publisherId))) {
            throw new AppError('Comment must have existing publisher.')
        }

        if (!Id.isValid(postId)) {
            throw new AppError('Comment must have valid post id.')
        }

        if (!(await PostsDB.doesPostExist(postId))) {
            throw new AppError('Comment must have existing post.')
        }

        if (replyToComment != null) {
            if (!Id.isValid(replyToComment)) {
                throw new AppError('Comment must have valid reply to comment id.')
            }

            if (!(await CommentsDB.doesCommentExist(replyToComment))) {
                throw new AppError('Comment must have existing reply to comment.')
            }
        }


        if (!TextChecker.checkValidate(comment)) {
            throw new AppError('Comment must have valid comment.')
        }

        return Object.freeze({
            publisherId: publisherId,
            postId: postId,
            comment: comment,
            replyToComment: replyToComment,
            id: Id.generate(),
            createdAt: Date.now(),

            likes: 0,
        })

    }
}

module.exports = { buildMakeComment }