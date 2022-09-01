import 'dart:convert';

import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/models/post_model.dart';
import 'package:instagram/services/ServerIP.dart';
import 'package:http/http.dart' as http;
import 'package:instagram/services/auth_service.dart';
import 'package:instagram/services/online_db_service.dart';
import 'package:mime/mime.dart';
import 'package:http_parser/src/media_type.dart';

class PostsDBService extends OnlineDBService {
  static final PostsDBService _postsDBService = PostsDBService._internal();

  factory PostsDBService() {
    return _postsDBService;
  }

  PostsDBService._internal();

  Future<Post> getPost(String postId) async {
    /*
    Returns some post

    param 1: the id of the post owner
    param 2: the id of the post
    */

    var response =
        await http.get(Uri.parse("${SERVER_API_URL}posts/$postId"), headers: {
      "authorization": AuthService().getAuthorizationHeader(),
    });

    checkErrors(response, ServerExceptionMessages.postDoesNotExist);

    return Post.fromJson(response.body);
  }

  // TODO: work on the real add posts
  Future uploadPost(
      {required String publisherComment,
      required String location,
      required List<String> photos,
      required List<String> taggedUsers}) async {
    /*
    Uploads new post

    param 1: the post
    */

    List<http.MultipartFile> files = [];
    for (var photo in photos) {
      final mimeTypeData = lookupMimeType(photo)!.split('/');
      files.add(await http.MultipartFile.fromPath('photos', photo,
          contentType: MediaType(mimeTypeData[0], mimeTypeData[1])));
    }

    var request =
        http.MultipartRequest("POST", Uri.parse("${SERVER_API_URL}posts/"));

    request.headers["authorization"] = AuthService().getAuthorizationHeader();

    request.fields['taggedUsers'] = taggedUsers.toString();
    request.fields['publisherComment'] = publisherComment;
    request.fields['location'] = location;
    request.files.addAll(files);

    final streamdResponse = await request.send();

    var response = await http.Response.fromStream(streamdResponse);

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);
  }

  Future deletePost(String postId) async {
    /*
    Deletes post

    param 1: the post id
    */

    var response = await http
        .delete(Uri.parse("${SERVER_API_URL}posts/$postId"), headers: {
      "authorization": AuthService().getAuthorizationHeader(),
    });

    checkErrors(response, ServerExceptionMessages.postDoesNotExist);
  }

  Future<List<Post>> getPostsByPublisherId(
      String publisherId, int startIndex) async {
    /*
    Returns the posts of user

    param 1: the user id
    param 2: how much posts have we already loaded
    param 3: to include the publisher in the response?
    */

    var response = await http.get(
        Uri.parse(
            "${SERVER_API_URL}posts?startIndex=$startIndex&publisherId=$publisherId"),
        headers: {
          "authorization": AuthService().getAuthorizationHeader(),
        });

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);

    List<Post> posts = [];
    for (var postObject in jsonDecode(response.body)) {
      Post post = Post.fromMap(postObject);
      posts.add(post);
    }
    return posts;
  }

  Future likePost(String postId) async {
    /*
    Likes post

    param 1: the id of the post
    */

    var response = await http.post(
      Uri.parse("${SERVER_API_URL}posts/$postId/like"),
      headers: {
        'Content-type': 'application/json',
        "authorization": AuthService().getAuthorizationHeader(),
      },
    );
    checkErrors(response, ServerExceptionMessages.postDoesNotExist);
  }

  Future unlikePost(String postId) async {
    /*
    Unlikes post

    param 1: the id of the post
    */

    var response = await http.post(
      Uri.parse("${SERVER_API_URL}posts/$postId/unlike"),
      headers: {
        'Content-type': 'application/json',
        "authorization": AuthService().getAuthorizationHeader(),
      },
    );

    checkErrors(response, ServerExceptionMessages.postDoesNotExist);
  }
}
