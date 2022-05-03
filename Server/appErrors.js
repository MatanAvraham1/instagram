const appErrors = {

    // User errors

    userNotExistsError: "user doesn't exists!",
    usernameAlreadyUsedError: "the username is already used!",

    userToFollowNotExistsError: "The user to follow doesn't exists!",
    userToUnfollowNotExistsError: "The user to unfollow doesn't exists!",

    alreadyFollowedError: "the first user already followed the seconds user!",
    alreadyUnfollowedError: "the first user doesn't follow the second user!",
    followRequestAlreadySentError: "follow request has been already sent!",
    followRequestNotExistsError: "the follow request doesn't exists!",

    invalidRegisterDetailsError: "invalid register details!",
    invalidLoginDetailsError: "invalid login details!",
    invalidUpdateDetailsError: "invalid update details!",
    wrongLoginDetailsError: "wrong login deatils!",
    cantFollowHimself: "user can't follow himself",


    // Post errors

    postNotExistsError: "post doesn't exist!",
    invalidPostError: "invalid post!",
    alreadyLikedError: "already liked!",
    alreadyUnlikedError: 'already unliked!',


    // Story errors

    storyNotExist: "story doesn't exist!",
    invalidStory: "invalid story!",
    viewerNotExists: "Can't add viewer becuase the viewer doesn't exists!",


    // Comment errors

    commentNotExist: "comment doesn't exists!",
    invalidCommentError: "invalid comment!",
    alreadyLikedError: 'already liked!',
    alreadyUnlikedError: 'already unliked!',

    // Chat errors

    chatNotExist: "chat doesn't exist!",
    invalidChat: "invalid chat!",
    memberNotInChat: "the memeber not in this chat!",
    memberAlreadyInChat: "the memeber is already in the chat!",


    // Message errors

    messageNotExist: "message doesn't exist!",
    invalidMessage: "invalid message!",
    alreadyLikedError: "the message is already liked!",
    alreadyUnlikedError: "the message is already unliked!",
}


module.exports = appErrors