import 'dart:convert';

import 'package:instagram/exeptions/auth_service_exeptions.dart';
import 'package:instagram/exeptions/error_codes.dart';
import 'package:instagram/exeptions/more_exepction.dart';
import 'package:instagram/exeptions/online_db_service_exeptions.dart';
import 'package:instagram/models/comment.dart';
import 'package:instagram/models/post.dart';
import 'package:instagram/models/user.dart';
import 'package:http/http.dart' as http;
import 'package:instagram/services/auth_service.dart';

class OnlineDBService {
  static const _serverApiUrl = "http://10.0.2.2:5000/api/";

  static Future<User> getCurrentUser() async {
    /*
    Returns the current connected user
    */

    var userId = await AuthSerivce.getUserId();
    return await getUserById(userId);
  }

  static Future<User> getUserById(String userId) async {
    /*
    Returns user by id [userId]

    */
    var response = await http.get(
      Uri.parse(_serverApiUrl + "users/$userId?filter=byId"),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.postNotExist) {
        throw UserNotExistExeption();
      }
    }
    if (response.statusCode == 403) {
      throw ForbiddenExeption();
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    var user = User.fromJson(jsonDecode(response.body));
    user.userId = userId;
    return user;
  }

  static Future<Post> getPost(String userId, String postId) async {
    /*
    Returns some post

    param 1: the id of the post owner
    param 2: the id of the post
    */

    var response = await http.get(
      Uri.parse(_serverApiUrl + "users/$userId/posts/$postId"),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.postNotExist) {
        throw PostNotExistExeption();
      }
    } else if (response.statusCode == 403) {
      throw ForbiddenExeption();
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    var post = Post.fromJson(jsonDecode(response.body));
    post.postId = postId;
    post.ownerId = userId;
    return post;
  }

  static Future uploadPost(Post post) async {
    /*
    Uploads new post

    param 1: the post
    */

    var userId = await AuthSerivce.getUserId();

    var response = await http.post(
      Uri.parse(_serverApiUrl + "users/$userId/posts"),
      headers: {
        'Content-type': 'application/json',
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
    } else if (response.statusCode == 403) {
      throw ForbiddenExeption();
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future deletePost(String postId) async {
    /*
    Deletes post

    param 1: the post id
    */

    var userId = await AuthSerivce.getUserId();

    var response = await http.delete(
      Uri.parse(_serverApiUrl + "users/$userId/posts/$postId"),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.postNotExist) {
        throw PostNotExistExeption();
      }
    } else if (response.statusCode == 403) {
      throw ForbiddenExeption();
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
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
      Uri.parse(
          _serverApiUrl + "users/$userId/posts/$postId/comments/$commentId"),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.userNotExist) {
        throw UserNotExistExeption();
      }
      if (errorCode == ErrorCodes.userNotExist) {
        throw PostNotExistExeption();
      }
      if (errorCode == ErrorCodes.commentNotExist) {
        throw CommentNotExistExeption();
      }
    } else if (response.statusCode == 403) {
      throw ForbiddenExeption();
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    var comment = Comment.fromJson(jsonDecode(response.body));
    comment.postId = postId;
    return comment;
  }

  static Future uploadComment(
      String userId, String postId, Comment comment) async {
    /*
    Uploads new post

    param 1: the id of the post owner
    param 2: the id of the post
    param 3: the comment
    */

    var userId = await AuthSerivce.getUserId();

    var response = await http.post(
      Uri.parse(_serverApiUrl + "users/$userId/posts/$postId/comments"),
      headers: {
        'Content-type': 'application/json',
      },
      body: jsonEncode({
        'comment': comment.comment,
      }),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.userNotExist) {
        throw UserNotExistExeption();
      }
      if (errorCode == ErrorCodes.postNotExist) {
        throw PostNotExistExeption();
      }
      if (errorCode == ErrorCodes.invalidComment) {
        throw InvalidCommentExeption();
      }
    } else if (response.statusCode == 403) {
      throw ForbiddenExeption();
    } else if (response.statusCode == 500) {
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
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.userNotExist) {
        throw UserNotExistExeption();
      }
      if (errorCode == ErrorCodes.postNotExist) {
        throw PostNotExistExeption();
      }
      if (errorCode == ErrorCodes.commentNotExist) {
        throw CommentNotExistExeption();
      }
    } else if (response.statusCode == 403) {
      throw ForbiddenExeption();
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  static Future updateUser(User user) async {
    /*
    Updates user details

    param 1: the user 
    */

    // var userId = await AuthSerivce.getUserId();

    var response = await http.patch(
      Uri.parse(_serverApiUrl + "users/${user.userId}/posts"),
      headers: {
        'Content-type': 'application/json',
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
    } else if (response.statusCode == 403) {
      throw ForbiddenExeption();
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }
  }

  Future<List<String>> getFollowers(String userId) async {
    /*  
    Returns the followers of user
    */

    var response = await http.get(
      Uri.parse(_serverApiUrl + "users/$userId/followers"),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.userNotExist) {
        throw UserNotExistExeption();
      }
    } else if (response.statusCode == 403) {
      throw ForbiddenExeption();
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    return jsonDecode(response.body);
  }

  Future<List<String>> getFollowing(String userId) async {
    /*  
    Returns the following of user
    */

    var response = await http.get(
      Uri.parse(_serverApiUrl + "users/$userId/following"),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.userNotExist) {
        throw UserNotExistExeption();
      }
    } else if (response.statusCode == 403) {
      throw ForbiddenExeption();
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    return jsonDecode(response.body);
  }

  Future getPosts(String userId) async {
    /*  
    Returns the following of user
    */

    var response = await http.get(
      Uri.parse(_serverApiUrl + "users/$userId/following"),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.userNotExist) {
        throw UserNotExistExeption();
      }
    } else if (response.statusCode == 403) {
      throw ForbiddenExeption();
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    return jsonDecode(response.body);
  }
}
