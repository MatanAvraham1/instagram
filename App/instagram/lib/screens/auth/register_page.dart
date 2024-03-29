import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/screens/auth/components/custom_alert_dialog.dart';
import 'package:instagram/screens/auth/components/online_button.dart';
import 'package:instagram/screens/auth/components/custom_form_field.dart';
import 'package:instagram/services/auth_service.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({Key? key}) : super(key: key);

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
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
                "Already have an account? ",
                style: TextStyle(color: Colors.grey, fontSize: 12),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.of(context).pop();
                },
                child: Text(
                  "Log In.",
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
            text: "Register",
            onPressed: () async {
              try {
                await AuthService().register(username, password);
                Navigator.of(context).pop();
              } on ServerException catch (e) {
                if (e.cause == ServerExceptionMessages.invalidUsername) {
                  showDialog(
                    context: context,
                    builder: (context) => const CustomAlertDialog(
                      title: "Invalid Username!",
                      description: "The username is invalid!",
                    ),
                  );
                } else if (e.cause == ServerExceptionMessages.InvalidPassword) {
                  showDialog(
                    context: context,
                    builder: (context) => const CustomAlertDialog(
                      title: "Invalid Password!",
                      description: "The password is invalid!",
                    ),
                  );
                } else if (e.cause == ServerExceptionMessages.usedUsername) {
                  showDialog(
                    context: context,
                    builder: (context) => const CustomAlertDialog(
                      title: "Invalid Username!",
                      description: "This username is already used!",
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
              }
            },
            enableWhen: () {
              return username.isNotEmpty && password.isNotEmpty;
            }),
      ],
    );
  }
}
