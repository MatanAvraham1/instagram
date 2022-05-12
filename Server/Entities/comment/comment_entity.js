function buildMakeComment({ Id, TextChecker, AppError, AppErrorMessages, UsersDB, PostsDB, CommentsDB }) {
    return async function makeComment({ publisherId, postId, comment }) {


        if (!Id.isValid(publisherId)) {
            throw new AppError(AppErrorMessages.invalidPublisherId)
        }

        if (!(await UsersDB.doesUserExist(publisherId))) {
            throw new AppError(AppErrorMessages.publisherDoesNotExist)
        }

        if (!Id.isValid(postId)) {
            throw new AppError(AppErrorMessages.invalidPostId)
        }

        if (!(await PostsDB.doesPostExist(postId))) {
            throw new AppError(AppErrorMessages.postDoesNotExist)
        }

        if (replyToComment != null) {
            if (!Id.isValid(replyToComment)) {
                throw new AppError(AppErrorMessages.invalidCommentId)
            }

            if (!(await CommentsDB.doesCommentExist(replyToComment))) {
                throw new AppError(AppErrorMessages.commentDoesNotExist)
            }
        }


        if (!TextChecker.checkValidate(comment)) {
            throw new AppError(AppErrorMessages.invalidComment)
        }

        return Object.freeze({
            publisherId: publisherId,
            postId: postId,
            comment: comment,
            replyToComment: replyToComment,
            id: Id.generate(),
            createdAt: Date.now(),

            likes: 0,
            replies: 0,
        })

    }
}

module.exports = { buildMakeComment }