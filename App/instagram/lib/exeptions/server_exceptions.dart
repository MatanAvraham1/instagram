class ServerException implements Exception {
  String cause;
  ServerException(this.cause);
}

class ServerExceptionMessages {
  // Auth
  static String invalidJwt = "Invalid jwt.";

  // Login
  static String wrongLoginDetails = 'Wrong username or password.';

  // user
  static String usedUsername = 'Username is already used.';
  static String invalidUsername = 'Invalid username.';
  static String InvalidPassword = 'Invalid password.';
  static String invalidFullname = "Invalid fullname.";
  static String invalidBio = "Invalid bio.";
  static String invalid_IsPrivate =
      "Invalid isPrivate : (must be True of False).";
  static String userDoesNotExist = "User doesn't exist.";
  static String invalidUserId = "Invalid id.";

  // post
  static String invalidLocation = 'Invalid location.';
  static String invalidTaggedUser = 'Invalid tagged user.';
  static String unexistTaggedUser = 'Tagged user does not exist.';
  static String invalidPhoto = 'Invalid photo.';
  static String invalidPublisherComment = 'Invalid publisher comment.';
  static String postDoesNotExist = "Post doesn't exist.";
  static String invalidPostId = "Invalid post id.";

  // comment
  static String invalidComment = 'Invalid comment.';
  static String commentDoesNotExist = "Comment doesn't exist.";
  static String invalidCommentId = "Invalid comment id.";

  // story
  static String invalidStoryStructure = 'Invalid story structure.';
  static String storyDoesNotExist = "Story doesn't exist.";
  static String invalidStoryId = "Invalid story id.";

  // Publisher
  static String invalidPublisherId = "Invalid publisher id.";
  static String publisherDoesNotExist = "Publisher does not exist.";

  // Friendships
  static String userCanNotFollowHimself = "User can't follow himself.";

  // Auth
  static String userNotConnected = "There is no user connected!";
  static String unauthorizedrequest = "The request is unauthorized!";
  static String forbiddenRequest = "The request is forbidden!";

  static String serverError = "There is a error in the server!";
}
