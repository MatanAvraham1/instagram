import 'dart:async';
import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/services/ServerIP.dart';
import 'package:instagram/services/online_db_service.dart';
import 'package:instagram/services/users_db_service.dart';

class AuthService extends OnlineDBService {
  static final AuthService _authSerivce = AuthService._internal();

  factory AuthService() {
    return _authSerivce;
  }

  AuthService._internal() {
    _androidOptions = const AndroidOptions(
      encryptedSharedPreferences: true,
    );
    _safeStorage = FlutterSecureStorage(aOptions: _androidOptions);
    _streamController = StreamController<User?>();
  }

  late final AndroidOptions _androidOptions;
  late final FlutterSecureStorage _safeStorage;
  late final StreamController<User?> _streamController;

  String? _jwt;
  String? _userId;
  User? connectedUser;

  Stream<User?> get userChanges {
    return _streamController.stream;
  }

  String getAuthorizationHeader() {
    if (!isUserLoggedIn()) {
      throw ServerException(ServerExceptionMessages.userNotConnected);
    }
    return "Bearer $_jwt";
  }

  String getUserId() {
    if (!isUserLoggedIn()) {
      throw ServerException(ServerExceptionMessages.userNotConnected);
    }
    return _userId!;
  }

  String getJwt() {
    if (!isUserLoggedIn()) {
      throw ServerException(ServerExceptionMessages.userNotConnected);
    }
    return _jwt!;
  }

  Future loadConnectedUserData() async {
    // Loads the connected user data (have to be called when the app launched)

    _jwt = await _safeStorage.read(key: "jwt");
    _userId = await _safeStorage.read(key: "userId");
  }

  Future loadConnectedUser() async {
    /*
    Loads the saved user from the safe storage and adds to the userChanges stream
    have to be called when the app launched
    */

    try {
      await loadConnectedUserData();

      var user = await UsersDBService().getConnectedUser();
      _streamController.add(user);
      connectedUser = user;
    } on ServerException catch (e) {
      if (e.cause == ServerExceptionMessages.userNotConnected) {
        _streamController.add(null);
        connectedUser = null;
      } else if (e.cause == ServerExceptionMessages.unauthorizedrequest) {
        // TODO: refresh token
        print("Refresh token!");
      }
    }
  }

  bool isUserLoggedIn() {
    /*
    Returns if there is a logged-in user
    */

    return _userId != null;
  }

  Future _saveLoginDetails(String jwt, String userId) async {
    /*
    Saves the login details to safe storage (the jwt, the user id)
    
    param 1: the jwt
    param 2: the user id
    */

    await _safeStorage.write(key: "jwt", value: jwt);
    await _safeStorage.write(key: "userId", value: userId);

    await loadConnectedUserData();
  }

  Future _deleteLoginDetails() async {
    /*
    Deletes the login details from the safe storage (the jwt, the user id)
    */

    await _safeStorage.delete(key: "jwt");
    await _safeStorage.delete(key: "userId");

    await loadConnectedUserData();
  }

  Future register(String username, String password) async {
    /*
    Signs up user and saves the returned token

    param 1: the username
    param 2: the password
    */
    var response = await http
        .post(
          Uri.parse(SERVER_API_URL + "register"),
          headers: {
            'Content-type': 'application/json',
          },
          body: jsonEncode({
            'username': username,
            'password': password,
          }),
        )
        .timeout(timeout);

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);

      throw ServerException(errorMessage);
    } else if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }

    var decodedResponse = jsonDecode(response.body);
    var jwt = decodedResponse["jwt"];
    var userId = decodedResponse["userId"];

    await _saveLoginDetails(jwt, userId);

    var user = await UsersDBService().getConnectedUser();
    _streamController.add(user);
    connectedUser = user;
    return user;
  }

  Future login(String username, String password) async {
    /*
    Signs in user and saves the returned token

    param 1: the username
    param 2: the password
    */
    var response = await http
        .post(
          Uri.parse(SERVER_API_URL + "login"),
          headers: {
            'Content-type': 'application/json',
          },
          body: jsonEncode({
            'username': username,
            'password': password,
          }),
        )
        .timeout(timeout);

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);

      throw ServerException(errorMessage);
    } else if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.wrongLoginDetails);
    } else if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }

    var decodedResponse = jsonDecode(response.body);
    var jwt = decodedResponse["jwt"];
    var userId = decodedResponse["userId"];

    await _saveLoginDetails(jwt, userId);

    var user = await UsersDBService().getConnectedUser();
    _streamController.add(user);
    connectedUser = user;
    return user;
  }

  Future signOut() async {
    /*
    Signs out
    */
    await _deleteLoginDetails();
    _streamController.add(null);
    connectedUser = null;
  }

  bool doesHasPermission(User user) {
    /*
    does we have permission to looks about private things of [user]

    likes stories count OR followers etc...
    
    param 1: the user object
    */

    return user.id == AuthService().getUserId() ||
        user.isFollowedByMe ||
        !user.isPrivate;
  }
}
