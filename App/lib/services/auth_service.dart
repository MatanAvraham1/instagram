import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:instagram/exeptions/auth_service_exeptions.dart';
import 'package:instagram/exeptions/error_codes.dart';
import 'package:instagram/exeptions/more_exepction.dart';

class AuthSerivce {
  static const _serverApiUrl = "http://10.0.2.2:5000/api/";
  static const _androidOptions = AndroidOptions(
    encryptedSharedPreferences: true,
  );
  static const _safeStorage = FlutterSecureStorage(aOptions: _androidOptions);

  static Future getUserId() async {
    if (!await isUserLoggedIn()) {
      throw NoUserLoggedInExeption();
    }

    return await _safeStorage.read(key: "userId");
  }

  static Future _saveJwt(String jwt) async {
    /*
    Saves jwt to the storage safely
    
    param 1: the token
    */

    await _safeStorage.write(key: "jwt", value: jwt);
  }

  static Future _deleteJwt() async {
    /*
    Deletes the jwt from storage 
    */

    const storage = FlutterSecureStorage(aOptions: _androidOptions);
    await storage.delete(key: "jwt");
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

  static Future register(String username, String password) async {
    /*
    Registers the user and saves the returned token

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

    await _saveJwt(jwt);
    await _safeStorage.write(key: "userId", value: userId);
  }

  static Future login(String username, String password) async {
    /*
    Logins the user and saves the returned token

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

    if (response.statusCode == 400) {
      var errorCode = jsonDecode(response.body)["errorCode"];

      if (errorCode == ErrorCodes.wrongUsernameOrPassword) {
        throw WrongUsernameOrPasswordExeption();
      }
    } else if (response.statusCode == 500) {
      throw ServerErrorExeption();
    }

    var decodedResponse = jsonDecode(response.body);
    var jwt = decodedResponse["jwt"];
    var userId = decodedResponse["userId"];

    await _saveJwt(jwt);
    await _safeStorage.write(key: "userId", value: userId);
  }

  static Future logOut() async {
    /*
    Log out the user
    */

    _deleteJwt();
    await _safeStorage.delete(key: "userId");
  }
}
