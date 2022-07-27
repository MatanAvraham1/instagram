import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/screens/auth/components/custom_alert_dialog.dart';
import 'package:instagram/screens/auth/components/online_button.dart';
import 'package:instagram/screens/auth/components/custom_form_field.dart';
import 'package:instagram/screens/auth/register_page.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:instagram/services/online_db_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  String username = "";
  String password = "";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      bottomNavigationBar: _buildBottomNavigationBar(),
      body: SafeArea(
        child: Center(
          child: Column(
            children: [
              GestureDetector(
                onTap: () {
                  showModalBottomSheet(
                    context: context,
                    builder: (context) => Container(),
                  );
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Text(
                      "English",
                      style: TextStyle(color: Colors.grey),
                    ),
                    Icon(Icons.keyboard_arrow_down, color: Colors.grey),
                  ],
                ),
              ),
              SizedBox(
                height: MediaQuery.of(context).size.height * 0.22,
              ),
              _buildForm(),
            ],
          ),
        ),
      ),
    );
  }

  SizedBox _buildBottomNavigationBar() {
    return SizedBox(
      height: kBottomNavigationBarHeight,
      child: Column(
        children: [
          const Divider(
            thickness: 1,
          ),
          const SizedBox(
            height: 7,
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                "Don't have an account? ",
                style: TextStyle(color: Colors.grey, fontSize: 12),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.of(context).push(MaterialPageRoute(
                    builder: (context) => const RegisterPage(),
                  ));
                },
                child: Text(
                  "Register.",
                  style: TextStyle(
                      color: Colors.blue[200],
                      fontSize: 12,
                      fontWeight: FontWeight.bold),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }

  Column _buildForm() {
    return Column(
      children: [
        Text(
          "Instagram",
          style: GoogleFonts.grandHotel(fontSize: 55),
        ),
        const SizedBox(
          height: 15,
        ),
        CustomFormField(
            hintText: 'Phone number, email or username',
            onChanged: (value) {
              setState(() {
                username = value;
              });
            }),
        const SizedBox(height: 10),
        CustomFormField(
            isPasswordField: true,
            hintText: 'Password',
            onChanged: (value) {
              setState(() {
                password = value;
              });
            }),
        const SizedBox(height: 10),
        OnlineButton(
          text: "Log In",
          onPressed: () async {
            try {
              if (!(await OnlineDBService().isThereInternetConnection())) {
                showDialog(
                  context: context,
                  builder: (context) => const CustomAlertDialog(
                    title: 'No Connection!',
                    description:
                        "No Internet Connection, please reconnect and try again..",
                    continueButton: "Ok",
                  ),
                );
              } else {
                await AuthService().login(username, password);
              }
            } on ServerException catch (e) {
              if (e.cause == ServerExceptionMessages.wrongLoginDetails) {
                showDialog(
                  context: context,
                  builder: (context) => const CustomAlertDialog(
                    title: 'Wrong Details!',
                    description: "Username or password is incorrent!",
                    continueButton: "Ok",
                  ),
                );
              } else if (e.cause == ServerExceptionMessages.serverError) {
                showDialog(
                  context: context,
                  builder: (context) => const CustomAlertDialog(
                    title: 'Server Error!',
                    description:
                        "Sorry, there is a problem with our server please try again later..",
                    continueButton: "Ok",
                  ),
                );
              }
            } on TimeoutException {
              showDialog(
                context: context,
                builder: (context) => const CustomAlertDialog(
                  title: 'Server Error!',
                  description:
                      "Sorry, our server is down please try again later..",
                  continueButton: "Ok",
                ),
              );
            }
          },
          enableWhen: () {
            return username.isNotEmpty && password.isNotEmpty;
          },
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              "Forget your login details? ",
              style: TextStyle(color: Colors.grey, fontSize: 12),
            ),
            GestureDetector(
              child: Text(
                "Get help loggin in",
                style: TextStyle(
                    color: Colors.blue[200],
                    fontSize: 12,
                    fontWeight: FontWeight.bold),
              ),
            ),
          ],
        )
      ],
    );
  }
}
