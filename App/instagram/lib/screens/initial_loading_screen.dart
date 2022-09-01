import 'dart:async';

import 'package:flutter/material.dart';
import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/auth/login_page.dart';
import 'package:instagram/screens/home/components/loading_indicator.dart';
import 'package:instagram/screens/main_page.dart';
import 'package:instagram/screens/no_internet_screen.dart';
import 'package:instagram/screens/server_down_screen.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:instagram/services/online_db_service.dart';

class InitialLoadingScreen extends StatefulWidget {
  const InitialLoadingScreen({Key? key}) : super(key: key);

  @override
  State<InitialLoadingScreen> createState() => _InitialLoadingScreenState();
}

class _InitialLoadingScreenState extends State<InitialLoadingScreen> {
  late bool noInternetConnection;
  late bool serverDown;
  bool loading = true;

  Future _initialLoading() async {
    if (!(await OnlineDBService.isThereInternetConnection())) {
      throw NoInternetException();
    }

    try {
      await AuthService().loadConnectedUser();
    } on TimeoutException {
      throw ServerDownException();
    }
  }

  Future callInitialLoading() async {
    try {
      await _initialLoading();
      setState(() {
        noInternetConnection = false;
        serverDown = false;
        loading = false;
      });
    } on ServerDownException {
      setState(() {
        serverDown = true;
        noInternetConnection = false;
        loading = false;
      });
    } on NoInternetException {
      setState(() {
        serverDown = false;
        noInternetConnection = true;
        loading = false;
      });
    }
  }

  @override
  void initState() {
    callInitialLoading();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(
        body: LoadingIndicator(
          title: "Loading Saved User...",
        ),
      );
    }

    if (serverDown) {
      return ServerDownScreen(
        onTap: () async {
          await callInitialLoading();
        },
      );
    }

    if (noInternetConnection) {
      return NoInternetScreen(
        onTap: () async {
          await Future.delayed(const Duration(milliseconds: 250));
          await callInitialLoading();
        },
      );
    }

    return StreamBuilder<User?>(
      stream: AuthService().userChanges,
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return const Text("Error!");
        }

        if (snapshot.data == null) {
          return const LoginPage();
        }

        return const MainPage();
      },
    );
  }
}
