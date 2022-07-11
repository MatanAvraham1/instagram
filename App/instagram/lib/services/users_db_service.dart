import 'dart:convert';

import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/services/ServerIP.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:http/http.dart' as http;

class UsersDBService {
  static Future<User> getConnectedUser() async {
    /*
    Returns the connected user
    */

    var userId = await AuthSerivce.getConnectedUserId();
    try {
      return await getUserById(userId);
    } on ServerException catch (e) {
      await AuthSerivce.signOut();
      throw ServerException(ServerExceptionMessages.userNotConnected);
    }
  }

  // TODO: add user deleting

  static Future<User> getUserById(String userId) async {
    /*
    Returns user by id [userId]
    */

    var response = await http
        .get(Uri.parse("${SERVER_API_URL}users/$userId?searchBy=Id"), headers: {
      "authorization": await AuthSerivce.getAuthorizationHeader(),
    });

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
      throw ServerException(ServerExceptionMessages.userDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }

    return User.fromJson(response.body);
  }

  static Future<User> getUserByUsername(String username) async {
    /*
    Returns user by his username
    */

    var response = await http.get(
        Uri.parse("${SERVER_API_URL}users/$username?searchBy=Username"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

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

    return User.fromJson(response.body);
  }

  static Future<User> getUserByFullname(String fullname) async {
    /*
    Returns user by his fullname
    */
    var response = await http.get(
        Uri.parse("${SERVER_API_URL}users/$fullname?searchBy=Fullname"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

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

    return User.fromJson(response.body);
  }

  static Future updateUser(User user) async {
    /*
    Updates user details

    param 1: the user 
    */

    var response = await http.patch(
      Uri.parse("$SERVER_API_URL/users/"),
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

  static Future<List<User>> getFollowers(String userId, int startIndex) async {
    /*
    Returns the followers of user

    param 1: the user id
    param 1: how much followers have we already load
    */

    var response = await http.get(
        Uri.parse(
            SERVER_API_URL + "users/$userId/followers?startIndex=$startIndex"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

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

    List<User> users = [];
    for (var userObject in jsonDecode(response.body)) {
      users.add(User.fromMap(userObject));
    }
    return users;
  }

  static Future<List<User>> getFollowings(String userId, int startIndex) async {
    /*
    Returns the following of user

    param 1: the user id
    param 2: how much following have we already load
    */

    var response = await http.get(
        Uri.parse(
            SERVER_API_URL + "users/$userId/followings?startIndex=$startIndex"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

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
    List<User> users = [];
    for (var userObject in jsonDecode(response.body)) {
      users.add(User.fromMap(userObject));
    }
    return users;
  }
}
