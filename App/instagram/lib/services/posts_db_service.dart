import 'dart:convert';

import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/models/post_model.dart';
import 'package:instagram/services/ServerIP.dart';
import 'package:http/http.dart' as http;
import 'package:instagram/services/auth_service.dart';

class PostsDBService {
  static Future<Post> getPost(String postId) async {
    /*
    Returns some post

    param 1: the id of the post owner
    param 2: the id of the post
    */

    var response =
        await http.get(Uri.parse("${SERVER_API_URL}posts/$postId"), headers: {
      "authorization": await AuthSerivce.getAuthorizationHeader(),
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

    return Post.fromJson(response.body);
  }

  // TODO: work on the real add posts
  static Future uploadPost(Post post) async {
    /*
    Uploads new post

    param 1: the post
    */

    var response = await http.post(
      Uri.parse("$SERVER_API_URL/posts/"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
      body: jsonEncode({
        'photos': post.photos,
        'taggedUsers': post.taggedUsers,
      }),
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
      throw ServerException(ServerExceptionMessages.userDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }
  }

  static Future deletePost(String postId) async {
    /*
    Deletes post

    param 1: the post id
    */

    var response = await http
        .delete(Uri.parse(SERVER_API_URL + "posts/$postId"), headers: {
      "authorization": await AuthSerivce.getAuthorizationHeader(),
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
  }

  static Future<List<Post>> getPostsByPublisherId(
      String publisherId, int startIndex) async {
    /*
    Returns the posts of user

    param 1: the user id
    param 2: how much posts have we already loaded
    param 3: to include the publisher in the response?
    */

    var response = await http.get(
        Uri.parse(SERVER_API_URL +
            "posts?startIndex=$startIndex&publisherId=$publisherId"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
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

    List<Post> posts = [];
    for (var postObject in jsonDecode(response.body)) {
      Post post = Post.fromMap(postObject);
      posts.add(post);
    }
    return posts;
  }

  static Future likePost(String postId) async {
    /*
    Likes post

    param 1: the id of the post
    */

    var response = await http.post(
      Uri.parse(SERVER_API_URL + "posts/$postId/like"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
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

  static Future unlikePost(String postId) async {
    /*
    Unlikes post

    param 1: the id of the post
    */

    var response = await http.post(
      Uri.parse(SERVER_API_URL + "posts/$postId/unlike"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
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
