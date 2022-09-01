import 'dart:convert';

import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/services/ServerIP.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:http/http.dart' as http;
import 'package:instagram/services/online_db_service.dart';

class UsersDBService extends OnlineDBService {
  static final UsersDBService _usersDBService = UsersDBService._internal();

  factory UsersDBService() {
    return _usersDBService;
  }

  UsersDBService._internal();

  Future<User> getConnectedUser() async {
    /*
    Returns the connected user
    */

    if (!AuthService().isUserLoggedIn()) {
      throw ServerException(ServerExceptionMessages.userNotConnected);
    }

    try {
      return await getUserById(AuthService().getUserId());
    } on ServerException {
      await AuthService().signOut();
      throw ServerException(ServerExceptionMessages.userNotConnected);
    }
  }

  // TODO: add user deleting

  Future<User> getUserById(String userId) async {
    /*
    Returns user by id [userId]
    */

    var response = await http
        .get(Uri.parse("${SERVER_API_URL}users/$userId?searchBy=Id"), headers: {
      "authorization": AuthService().getAuthorizationHeader(),
    }).timeout(timeout);

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);

    return User.fromJson(response.body);
  }

  Future<User> getUserByUsername(String username) async {
    /*
    Returns user by his username
    */

    var response = await http.get(
        Uri.parse("${SERVER_API_URL}users/$username?searchBy=Username"),
        headers: {
          "authorization": AuthService().getAuthorizationHeader(),
        });

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);

    return User.fromJson(response.body);
  }

  Future<User> getUserByFullname(String fullname) async {
    /*
    Returns user by his fullname
    */
    var response = await http.get(
        Uri.parse("${SERVER_API_URL}users/$fullname?searchBy=Fullname"),
        headers: {
          "authorization": AuthService().getAuthorizationHeader(),
        });

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);

    return User.fromJson(response.body);
  }

  Future updateUser(User user) async {
    /*
    Updates user details

    param 1: the user 
    */

    var response = await http.patch(
      Uri.parse("$SERVER_API_URL/users/"),
      headers: {
        'Content-type': 'application/json',
        "authorization": AuthService().getAuthorizationHeader(),
      },
      body: jsonEncode({
        'username': user.username,
        'fullname': user.fullname,
        'bio': user.bio,
        'isPrivate': user.isPrivate
      }),
    );
    checkErrors(response, ServerExceptionMessages.userDoesNotExist);
  }

  Future<List<User>> getFollowers(String userId, int startIndex) async {
    /*
    Returns the followers of user

    param 1: the user id
    param 1: how much followers have we already load
    */

    var response = await http.get(
        Uri.parse(
            "${SERVER_API_URL}users/$userId/followers?startIndex=$startIndex"),
        headers: {
          "authorization": AuthService().getAuthorizationHeader(),
        });

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);

    List<User> users = [];
    for (var userObject in jsonDecode(response.body)) {
      users.add(User.fromMap(userObject));
    }
    return users;
  }

  Future<List<User>> getFollowings(String userId, int startIndex) async {
    /*
    Returns the following of user

    param 1: the user id
    param 2: how much following have we already load
    */

    var response = await http.get(
        Uri.parse(
            "${SERVER_API_URL}users/$userId/followings?startIndex=$startIndex"),
        headers: {
          "authorization": AuthService().getAuthorizationHeader(),
        });

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);

    List<User> users = [];
    for (var userObject in jsonDecode(response.body)) {
      users.add(User.fromMap(userObject));
    }
    return users;
  }
}
