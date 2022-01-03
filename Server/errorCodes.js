const errorCodes = {
    missingQueryParam: 100,
    userNotExist: 200,
    usernameAlreadyUsed: 201,
    invalidUsernameOrPassword: 202,
    wrongUsernameOrPassword: 300,
    postNotExist: 400,
    invalidPost: 401,
    commentNotExist: 500,
    invalidComment: 501,
    alreadyLiked: 600,
    alreadyUnliked: 601,
    invalidUpdateValues: 700,
    cantFollowHimself: 800,
    userNotInFollowRequests: 900,
    userNotInFollowingRequests: 901,
    followRequestAlreadySent: 1000,
    alreadyFollowed: 2000,
    alreadyUnfollowed: 2001,
    missingUserToAccept: 3000,
    missingUserToDelete: 4000,
    invalidStory: 5000,
    storyNotExist: 5001
}

module.exports = { errorCodes }