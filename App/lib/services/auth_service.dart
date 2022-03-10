import 'dart:async';
import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:instagram/exeptions/auth_service_exeptions.dart';
import 'package:instagram/exeptions/error_codes.dart';
import 'package:instagram/exeptions/more_exepction.dart';
import 'package:instagram/exeptions/online_db_service_exeptions.dart';
import 'package:instagram/models/user.dart';
import 'package:instagram/services/online_db_service.dart';

class AuthSerivce {
  static const _serverApiUrl = "http://10.0.2.2:5000/api/";
  static const _androidOptions = AndroidOptions(
    encryptedSharedPreferences: true,
  );
  static const _safeStorage = FlutterSecureStorage(aOptions: _androidOptions);
  static final _streamController = StreamController<User?>();
  static User? connectedUser;

  static Stream<User?> get userChanges {
    return _streamController.stream;
  }

  static Future getAuthorizationHeader() async {
    /*
    Returns the authorization header
    */

    var jwt = await _safeStorage.read(key: "jwt");
    return "Bearer $jwt";
  }

  static Future isUserLoggedIn() async {
    /*
    Returns if there is a logged-in user
    */
    // = _getAndroidOptions();
    const storage = FlutterSecureStorage(
      aOptions: _androidOptions,
    );
    String? value = await storage.read(key: "jwt");

    if (value == null) {
      return false;
    }
    return true;
  }

  static Future _saveLoginDetails(String jwt, String userId) async {
    /*
    Saves the login details to safe storage (the jwt, the user id)
    
    param 1: the jwt
    param 2: the user id
    */

    await _safeStorage.write(key: "jwt", value: jwt);
    await _safeStorage.write(key: "userId", value: userId);
  }

  static Future _deleteLoginDetails() async {
    /*
    Deletes the login details from the safe storage (the jwt, the user id)
    */

    await _safeStorage.delete(key: "jwt");
    await _safeStorage.delete(key: "userId");
  }

  static Future getConnectedUserId() async {
    if (!await isUserLoggedIn()) {
      throw NoUserLoggedInExeption();
    }

    return await _safeStorage.read(key: "userId");
  }

  static Future loadConnectedUser() async {
    /*
    Loads the saved user from the safe storage and adds to the userChanges stream
    */

    try {
      var user = await OnlineDBService.getConnectedUser();
      _streamController.add(user);
      connectedUser = user;
    } on NoUserLoggedInExeption {
      _streamController.add(null);
      connectedUser = null;
    } on UnauthorizedException {
      // TODO: refresh token
      print("Refresh token!");
    }
  }

  static Future signUp(String username, String password) async {
    /*
    Signs up user and saves the returned token

    param 1: the username
    param 2: the password
    */
    var response = await http.post(
      Uri.parse(_serverApiUrl + "register"),
      headers: {
        'Content-type': 'application/json',
      },
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.usernameAlreadyUsed) {
        throw UsernameAlreadyUsedExeption();
      } else if (errorCode == ErrorCodes.invalidUsernameOrPassword) {
        throw InvalidUsernameOrPasswordExeption();
      }
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    var decodedResponse = jsonDecode(response.body);
    var jwt = decodedResponse["jwt"];
    var userId = decodedResponse["userId"];

    await _saveLoginDetails(jwt, userId);

    var user = await OnlineDBService.getConnectedUser();
    _streamController.add(user);
    connectedUser = user;
    return user;
  }

  static Future signIn(String username, String password) async {
    /*
    Signs in user and saves the returned token

    param 1: the username
    param 2: the password
    */
    var response = await http.post(
      Uri.parse(_serverApiUrl + "login"),
      headers: {
        'Content-type': 'application/json',
      },
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    if (response.statusCode == 404) {
      throw WrongUsernameOrPasswordExeption();
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    var decodedResponse = jsonDecode(response.body);
    var jwt = decodedResponse["jwt"];
    var userId = decodedResponse["userId"];

    await _saveLoginDetails(jwt, userId);

    var user = await OnlineDBService.getConnectedUser();
    _streamController.add(user);
    connectedUser = user;
    return user;
  }

  static Future signOut() async {
    /*
    Signs out
    */
    await _deleteLoginDetails();
    _streamController.add(null);
    connectedUser = null;
  }
}
