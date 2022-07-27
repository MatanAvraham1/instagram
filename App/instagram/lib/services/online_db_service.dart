import 'dart:convert';

import 'package:http/http.dart';
import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:internet_connection_checker/internet_connection_checker.dart';

class OnlineDBService {
  static final OnlineDBService _onlineDBService = OnlineDBService._internal();

  factory OnlineDBService() {
    return _onlineDBService;
  }

  OnlineDBService._internal();

  Duration timeout = const Duration(seconds: 5);

  Future isThereInternetConnection() async {
    return await InternetConnectionChecker().hasConnection;
  }

  void checkErrors(Response response, String code404) {
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
      throw ServerException(code404);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }
  }
}
