class AppError extends Error {
    constructor(message) {
        super(message)
        this.name = "AppError"
    }
}


class AppErrorMessages {

    // Auth
    static invalidJwt = "Invalid jwt."

    // Login
    static wrongLoginDetails = 'Wrong username or password.'

    // user
    static usedUsername = 'Username is already used.'
    static invalidUsername = 'Invalid username.'
    static InvalidPassword = 'Invalid password.'
    static invalidFullname = "Invalid fullname"
    static invalidBio = "Invalid bio"
    static invalid_IsPrivate = "Invalid isPrivate : (must be True of False)"
    static userDoesNotExist = "User doesn't exist."
    static invalidUserId = "Invalid id."

    // post
    static invalidLocation = 'Invalid location.'
    static invalidTaggedUser = 'Invalid tagged user.'
    static unexistTaggedUser = 'Tagged user does not exist.'
    static invalidPhoto = 'Invalid photo.'
    static invalidPublisherComment = 'Invalid publisher comment.'
    static postDoesNotExist = "Post doesn't exist."
    static invalidPostId = "Invalid post id."

    // comment
    static invalidComment = 'Invalid comment.'
    static commentDoesNotExist = "Comment doesn't exist."
    static invalidCommentId = "Invalid comment id."

    // story
    static invalidStoryStructure = 'Invalid story structure.'
    static storyDoesNotExist = "Story doesn't exist."
    static invalidStoryId = "Invalid story id"

    static invalidPublisherId = "Invalid publisher id."
    static publisherDoesNotExist = "Publisher does not exist"


    static userCanNotFollowHimself = "User can't follow himself"


    // delete user
    // static canNotDeleteCommentByInvalidId = "Can't delete comment by invalid id."
    // static canNotGetCommentByInvalidId = "Can't get comment by invalid id."

}

module.exports = { AppError, AppErrorMessages }