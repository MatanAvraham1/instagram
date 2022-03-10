import 'dart:convert';

import 'package:instagram/exeptions/auth_service_exeptions.dart';
import 'package:instagram/exeptions/error_codes.dart';
import 'package:instagram/exeptions/more_exepction.dart';
import 'package:instagram/exeptions/online_db_service_exeptions.dart';
import 'package:instagram/models/comment.dart';
import 'package:instagram/models/post.dart';
import 'package:instagram/models/story.dart';
import 'package:instagram/models/user.dart';
import 'package:http/http.dart' as http;
import 'package:instagram/services/auth_service.dart';

class OnlineDBService {
  static const _serverApiUrl = "http://10.0.2.2:5000/api/";

  static Future<User> getConnectedUser() async {
    /*
    Returns the connected user
    */

    var userId = await AuthSerivce.getConnectedUserId();
    try {
      return await getUserById(userId);
    } on UserNotExistExeption {
      await AuthSerivce.signOut();
      throw NoUserLoggedInExeption();
    }
  }

  static Future<User> getUserById(String userId) async {
    /*
    Returns user by id [userId]
    */

    var response = await http.get(
        Uri.parse(_serverApiUrl + "users/$userId?searchBy=byId"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    return User.fromJson(response.body);
  }

  static Future<User> getUserByUsername(String username) async {
    /*
    Returns user by his username
    */

    var response = await http.get(
        Uri.parse(_serverApiUrl + "users/$username?searchBy=byUsername"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    return User.fromJson(response.body);
  }

  static Future<User> getUserByFullname(String fullname) async {
    /*
    Returns user by his fullname
    */

    var response = await http.get(
        Uri.parse(_serverApiUrl + "users/$fullname?searchBy=byFullname"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    return User.fromJson(jsonDecode(response.body));
  }

  static Future updateUser(User user) async {
    /*
    Updates user details

    param 1: the user 
    */

    var response = await http.patch(
      Uri.parse(_serverApiUrl + "users/${user.id}"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
      body: jsonEncode({
        'username': user.username,
        'fullname': user.fullname,
        'bio': user.bio,
        'isPrivate': user.isPrivate
      }),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.usernameAlreadyUsed) {
        throw UsernameAlreadyUsedExeption();
      }
      if (errorCode == ErrorCodes.invalidUpdateValues) {
        throw InvalidUpdateValuesExeption();
      }
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future<Post> getPost(String userId, String postId) async {
    /*
    Returns some post

    param 1: the id of the post owner
    param 2: the id of the post
    param 3: include the publisher user object in the response?
    */

    var response = await http.get(
        Uri.parse(_serverApiUrl +
            "users/$userId/posts/$postId?includePublisherInResponse=${true}"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw PostNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    return Post.fromJson(jsonDecode(response.body));
  }

  static Future uploadPost(Post post) async {
    /*
    Uploads new post

    param 1: the post
    */

    var userId = await AuthSerivce.getConnectedUserId();

    var response = await http.post(
      Uri.parse(_serverApiUrl + "users/$userId/posts"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
      body: jsonEncode({
        'photosUrls': post.photosUrls,
        'taggedUsers': post.taggedUsers,
      }),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.invalidPost) {
        throw InvalidPostExeption();
      }
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future deletePost(String postId) async {
    /*
    Deletes post

    param 1: the post id
    */

    var userId = await AuthSerivce.getConnectedUserId();

    var response = await http.delete(
        Uri.parse(_serverApiUrl + "users/$userId/posts/$postId"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw PostNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future<List<Post>> getPosts(String userId, int startFrom,
      {bool includePublisherInResponse = true}) async {
    /*  
    Returns the posts of user

    param 1: the user id
    param 2: how much posts have we already loaded
    param 3: to include the publisher in the response?
    */

    var response = await http.get(
        Uri.parse(_serverApiUrl +
            "users/$userId/posts?startFrom=$startFrom&includePublisherInResponse=$includePublisherInResponse"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    List<Post> posts = [];
    for (var postObject in jsonDecode(response.body)) {
      Post post = Post.fromMap(postObject);
      posts.add(post);
    }
    return posts;
  }

  static Future<List<Post>> getFeedPosts(int startFrom) async {
    /*  
    Returns the posts of user's followings by date

    param 1: the user id
    param 2: how much posts have we already loaded
    */

    String userId = await AuthSerivce.getConnectedUserId();

    var response = await http.get(
        Uri.parse(_serverApiUrl +
            "users/$userId/posts/feed?startFrom=$startFrom&includePublisherInResponse=${true}"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    List<Post> posts = [];
    for (var postObject in jsonDecode(response.body)) {
      Post post = Post.fromMap(postObject);
      posts.add(post);
    }
    return posts;
  }

  static Future<Comment> getComment(
      String userId, String postId, String commentId) async {
    /*
    Returns some comment

    param 1: the id of the post owner
    param 2: the id of the post
    param 3: the id of the comment
    */

    var response = await http.get(
        Uri.parse(_serverApiUrl +
            "users/$userId/posts/$postId/comments/$commentId?includePublisherInResponse=${true}"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw CommentNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    var comment = Comment.fromJson(jsonDecode(response.body));
    comment.postId = postId;
    return comment;
  }

  static Future<List<Comment>> getComments(
      String userId, String postId, int startFrom,
      {bool includePublisherInResponse = true}) async {
    /*
    Returns comments of post

    param 1: the id of the post owner
    param 2: the id of the post
    param 3: how much comments have we already loaded
    param 4: to include the publisher in the response?

    */

    var response = await http.get(
        Uri.parse(_serverApiUrl +
            "users/$userId/posts/$postId/comments?startFrom=$startFrom&includePublisherInResponse=$includePublisherInResponse"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw PostNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    List<Comment> comments = [];
    for (var commentObject in jsonDecode(response.body)) {
      var comment = Comment.fromMap(commentObject);
      comment.postId = postId;
      comments.add(comment);
    }

    return comments;
  }

  static Future uploadComment(
      String userId, String postId, Comment comment) async {
    /*
    Uploads new post

    param 1: the id of the post owner
    param 2: the id of the post
    param 3: the comment
    */

    var userId = await AuthSerivce.getConnectedUserId();

    var response = await http.post(
      Uri.parse(_serverApiUrl + "users/$userId/posts/$postId/comments"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
      body: jsonEncode({
        'comment': comment.comment,
      }),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.invalidComment) {
        throw InvalidCommentExeption();
      }
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw PostNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future deleteComment(
      String userId, String postId, String commentId) async {
    /*
    Deletes comment

    param 1: the id of the post owner
    param 2: the id of the post
    param 3: the id of the comment
    */

    var response = await http.delete(
        Uri.parse(
            _serverApiUrl + "users/$userId/posts/$postId/comments/$commentId"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw CommentNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future<List<User>> getFollowers(String userId, int startFrom) async {
    /*  
    Returns the followers of user

    param 1: the user id
    param 1: how much followers have we already load
    */

    var response = await http.get(
        Uri.parse(
            _serverApiUrl + "users/$userId/followers?startFrom=$startFrom"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    List<User> users = [];
    for (var userObject in jsonDecode(response.body)) {
      users.add(User.fromMap(userObject));
    }
    return users;
  }

  static Future<List<User>> getFollowings(String userId, int startFrom) async {
    /*  
    Returns the following of user

    param 1: the user id
    param 2: how much following have we already load
    */

    var response = await http.get(
        Uri.parse(
            _serverApiUrl + "users/$userId/followings?startFrom=$startFrom"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    List<User> users = [];
    for (var userObject in jsonDecode(response.body)) {
      users.add(User.fromMap(userObject));
    }
    return users;
  }

  static Future followUser(String userId) async {
    /*
    Follows user

    param 1: the id of the user
    */

    var response = await http.post(
      Uri.parse(_serverApiUrl + "users/$userId/followers"),
      headers: {
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.cantFollowHimself) {
        throw UserCantFollowHimselfExeption();
      }
      if (errorCode == ErrorCodes.alreadyFollowed) {
        throw UserAlreadyFollowedExeption();
      }
      if (errorCode == ErrorCodes.followRequestAlreadySent) {
        throw FollowRequestAlreadySentExeption();
      }
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future unfollowUser(String userId) async {
    /*
    Unfollow user

    param 1: the id of the user
    */

    var response = await http.delete(
      Uri.parse(_serverApiUrl + "users/$userId/followers"),
      headers: {
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.cantFollowHimself) {
        throw UserCantFollowHimselfExeption();
      }
      if (errorCode == ErrorCodes.alreadyUnfollowed) {
        throw UserAlreadyUnfollowedExeption();
      }
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future acceptFollowRequest(String userToAccept) async {
    /*
    Accepts follow request 

    param 1: the id of the user to accept
    */

    var connectedUserId = await AuthSerivce.getConnectedUserId();
    var response = await http.post(
      Uri.parse(_serverApiUrl +
          "users/$connectedUserId/followRequests?userToAccept=$userToAccept"),
      headers: {
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      throw MissingUserToAcceptExeption();
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotInFollowRequestsExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future deleteFollowRequest(String userToDelete) async {
    /*
    Deletes follow request 

    param 1: the id of the user to delete
    */

    var connectedUserId = await AuthSerivce.getConnectedUserId();
    var response = await http.delete(
      Uri.parse(_serverApiUrl +
          "users/$connectedUserId/followRequests?userToDelete=$userToDelete"),
      headers: {
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      throw MissingUserToAcceptExeption();
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotInFollowRequestsExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future deleteFollowingRequest(String userToDelete) async {
    /*
    Deletes following request 

    param 1: the id of the user to delete
    */

    var connectedUserId = await AuthSerivce.getConnectedUserId();
    var response = await http.delete(
      Uri.parse(_serverApiUrl +
          "users/$connectedUserId/followingRequests?userToDelete=$userToDelete"),
      headers: {
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      throw MissingUserToAcceptExeption();
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotInFollowRequestsExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future<Story> getStory(String userId, String storyId) async {
    /*
    Returns some story

    param 1: the id of the story owner
    param 2: the id of the story
    */

    var response = await http.get(
        Uri.parse(_serverApiUrl + "users/$userId/stories/$storyId"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw StoryNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    var story = Story.fromJson(jsonDecode(response.body));
    story.ownerUid = userId;
    return story;
  }

  static Future<List<Story>> getLast24HoursStories(String userId) async {
    /*
    Returns all the stories from the last 24 hours

    param 1: the id of stories' owner
    */

    var response = await http
        .get(Uri.parse(_serverApiUrl + "users/$userId/stories/"), headers: {
      "authorization": await AuthSerivce.getAuthorizationHeader(),
    });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    List<Story> stories = [];
    for (var storyObject in jsonDecode(response.body)) {
      Story story = Story.fromMap(storyObject);
      story.ownerUid = userId;
      stories.add(story);
    }
    return stories;
  }

  static Future<List<Story>> getStoriesArchive() async {
    /*
    Returns the stories archive
    */

    String userId = await AuthSerivce.getConnectedUserId();

    var response = await http.get(
        Uri.parse(_serverApiUrl + "users/$userId/stories/archive"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    List<Story> stories = [];
    for (var storyObject in jsonDecode(response.body)) {
      Story story = Story.fromJson(storyObject);
      story.ownerUid = userId;
      stories.add(story);
    }
    return stories;
  }

  static Future deleteStory(String storyId) async {
    /*
    Deletes story

    param 1: the story id
    */

    var userId = await AuthSerivce.getConnectedUserId();

    var response = await http.delete(
        Uri.parse(_serverApiUrl + "users/$userId/stories/$storyId"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw StoryNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future uploadStory(Story story) async {
    /*
    Uploads new story

    param 1: the story
    */

    var userId = await AuthSerivce.getConnectedUserId();

    var response = await http.post(
      Uri.parse(_serverApiUrl + "users/$userId/stories"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
      body: jsonEncode({
        'photoUrl': story.photoUrl,
      }),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.invalidStory) {
        throw InvalidStoryExeption();
      }
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future<List<User>> whichOfMyFollowingPublishedStories(
      int startFrom) async {
    /*
    Returns list of the followings who have published a story

    param 1: how much followings have we already load
    */

    String userId = await AuthSerivce.getConnectedUserId();

    var response = await http.get(
        Uri.parse(_serverApiUrl +
            "users/$userId/stories/following?startFrom=$startFrom"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    List<User> users = [];
    for (var item in jsonDecode(response.body)) {
      users.add(User.fromMap(item));
    }

    return users;
  }

  static Future likePost(String userId, String postId) async {
    /*
    Likes post

    param 1: the id of the post owner
    param 2: the id of the post
    */

    var response = await http.post(
      Uri.parse(_serverApiUrl + "users/$userId/posts/$postId/likes"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.alreadyLiked) {
        throw PostAlreadyLikedException();
      }
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future unlikePost(String userId, String postId) async {
    /*
    Unlikes post

    param 1: the id of the post owner
    param 2: the id of the post
    */

    var response = await http.delete(
      Uri.parse(_serverApiUrl + "users/$userId/posts/$postId/likes"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.alreadyUnliked) {
        throw PostAlreadyUnlikedException();
      }
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future likeComment(
      String userId, String postId, String commentId) async {
    /*
    Likes comment

    param 1: the id of the post owner
    param 2: the id of the post
    param 3: the id of the comment
    */

    var response = await http.post(
      Uri.parse(_serverApiUrl +
          "users/$userId/posts/$postId/comments/$commentId/likes"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.alreadyLiked) {
        throw CommentAlreadyLikedException();
      }
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future unlikeComment(
      String userId, String postId, String commentId) async {
    /*
    Unlikes comment

    param 1: the id of the post owner
    param 2: the id of the post
    param 3: the id of the comment
    */

    var response = await http.delete(
      Uri.parse(_serverApiUrl +
          "users/$userId/posts/$postId/comments/$commentId/likes"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.alreadyUnliked) {
        throw CommentAlreadyUnlikedException();
      }
    }
    if (response.statusCode == 401) {
      throw UnauthorizedException();
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    }
    if (response.statusCode == 404) {
      throw UserNotExistExeption();
    }
    if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }
}
