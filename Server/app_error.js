class AppError extends Error {
    constructor(message, additionalData) {
        super(message)
        this.name = "AppError"
        this.additionalData = additionalData
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
    static invalidFullname = "Invalid fullname."
    static invalidBio = "Invalid bio."
    static invalid_IsPrivate = "Invalid isPrivate : (must be True of False)."
    static userDoesNotExist = "User doesn't exist."
    static invalidUserId = "Invalid id."
    static invalidProfilePhoto = "Invalid profile photo."

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
    static invalidStoryId = "Invalid story id."
    static invalidWidget = "invalid widget."

    // Publisher
    static invalidPublisherId = "Invalid publisher id."
    static publisherDoesNotExist = "Publisher does not exist."

    // Friendships
    static userCanNotFollowHimself = "User can't follow himself."
    static alreadyFollow = "The user is already follow"
    static alreadyUnfollow = "The user is already unfollow"
    static followRequestDoesNotExist = "The follow request doesn't exist!"
    static alreadyRequested = "Follow request has been already sent"

    static invalidStartIndex = "Invalid start index."


    // Story Widget
    static invalidWidgetName = "Invalid widget name"
    static invalidWidgetDescription = "Invalid widget description"
    static widgetDoesNotExist = "The widget does not exist"
}

module.exports = { AppError, AppErrorMessages }