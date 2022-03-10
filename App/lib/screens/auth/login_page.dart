import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:instagram/exeptions/auth_service_exeptions.dart';
import 'package:instagram/exeptions/more_exepction.dart';
import 'package:instagram/screens/auth/components/custom_alert_dialog.dart';
import 'package:instagram/screens/auth/components/custom_button.dart';
import 'package:instagram/screens/auth/components/custom_form_field.dart';
import 'package:instagram/screens/auth/register_page.dart';
import 'package:instagram/services/auth_service.dart';

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
        CustomButton(
          text: "Log In",
          onPressed: () async {
            try {
              await AuthSerivce.signIn(username, password);
            } on WrongUsernameOrPasswordExeption {
              showDialog(
                context: context,
                builder: (context) => const CustomAlertDialog(
                  title: 'Wrong Details!',
                  description: "Username or password is incorrent!",
                  continueButton: "Ok",
                ),
              );
            } on ServerErrorExeption {
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
