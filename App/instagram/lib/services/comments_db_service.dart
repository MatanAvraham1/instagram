import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/models/comment_model.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/services/ServerIP.dart';
import 'package:instagram/services/auth_service.dart';

class CommentsDBService {
  static Future<Comment> getComment(String commentId) async {
    /*
    Returns some comment

    param 1: the id of the post owner
    param 2: the id of the post
    param 3: the id of the comment
    */

    var response = await http
        .get(Uri.parse(SERVER_API_URL + "comments/$commentId"), headers: {
      "authorization": AuthSerivce.getAuthorizationHeader(),
    });

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);
      ;

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.commentDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }

    return Comment.fromJson(response.body);
  }

  static Future<List<Map<User, Comment>>> getCommentsByPostId(
    String postId,
    int startIndex,
  ) async {
    /*
    Returns comments of post

    param 1: the id of the post
    param 2: how much comments have we already loaded
    */

    var response = await http.get(
        Uri.parse(SERVER_API_URL +
            "comments?startIndex=$startIndex&postId=$postId&includePublisher=true"),
        headers: {
          "authorization": AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);
      ;

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.postDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }

    List<Map<User, Comment>> comments = [];
    for (var commentObject in jsonDecode(response.body)) {
      comments.add({
        User.fromMap(commentObject.publisher): Comment.fromMap(commentObject)
      });
    }

    return comments;
  }

  static Future<List<Comment>> getCommentsByPublisherId(
    String publisherId,
    int startIndex,
  ) async {
    /*
    Returns comments of publisher

    param 1: the id of the publisher
    param 2: how much comments have we already loaded

    */

    var response = await http.get(
        Uri.parse(SERVER_API_URL +
            "comments?startIndex=$startIndex&publisherId=$publisherId"),
        headers: {
          "authorization": AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);
      ;

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.userDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }

    List<Comment> comments = [];
    for (var commentObject in jsonDecode(response.body)) {
      comments.add(Comment.fromMap(commentObject));
    }

    return comments;
  }

  static Future<List<Comment>> getReplies(
    String commentId,
    int startIndex,
  ) async {
    /*
    Returns comments of publisher

    param 1: the id of the publisher
    param 2: how much comments have we already loaded

    */

    var response = await http.get(
        Uri.parse(SERVER_API_URL +
            "comments?startIndex=$startIndex&replyToComment=$commentId"),
        headers: {
          "authorization": AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);
      ;

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.commentDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }

    List<Comment> comments = [];
    for (var commentObject in jsonDecode(response.body)) {
      comments.add(Comment.fromMap(commentObject));
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

    var response = await http.post(
      Uri.parse(SERVER_API_URL + "comments/"),
      headers: {
        'Content-type': 'application/json',
        "authorization": AuthSerivce.getAuthorizationHeader(),
      },
      body: jsonEncode({
        'comment': comment.comment,
      }),
    );

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.postDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }
  }

  static Future deleteComment(String commentId) async {
    /*
    Deletes comment

    param 1: the id of the comment
    */

    var response =
        await http.delete(Uri.parse(SERVER_API_URL + "comments/"), headers: {
      "authorization": AuthSerivce.getAuthorizationHeader(),
    });

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);
      ;

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.commentDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }
  }

  static Future likeComment(String commentId) async {
    /*
    Likes comment

    param 1: the id of the comment
    */

    var response = await http.post(
      Uri.parse(SERVER_API_URL + "comments/$commentId/like"),
      headers: {
        'Content-type': 'application/json',
        "authorization": AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);
      ;

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.commentDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }
  }

  static Future unlikeComment(String commentId) async {
    /*
    Unlikes comment

    param 1: the id of the comment
    */

    var response = await http.post(
      Uri.parse(SERVER_API_URL + "comments/$commentId/unlike"),
      headers: {
        'Content-type': 'application/json',
        "authorization": AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);
      ;

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.postDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }
  }
}
