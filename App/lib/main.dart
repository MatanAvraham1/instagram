import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'package:instagram/classes/navigator_keys.dart';
import 'package:instagram/screens/auth/register_page.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Provider(
        create: (context) => NavigatorKeys(),
        builder: (context, child) {
          return MaterialApp(
            themeMode: ThemeMode.dark,
            darkTheme: ThemeData(
              appBarTheme: const AppBarTheme(backgroundColor: Colors.black),
              scaffoldBackgroundColor: Colors.black,
              brightness: Brightness.dark,
              bottomNavigationBarTheme: const BottomNavigationBarThemeData(
                backgroundColor: Colors.black,
                selectedItemColor: Colors.white,
                unselectedItemColor: Colors.white,
                type: BottomNavigationBarType.fixed,
                showUnselectedLabels: false,
                showSelectedLabels: false,
              ),
              pageTransitionsTheme: const PageTransitionsTheme(
                builders: {
                  TargetPlatform.android: SharedAxisPageTransitionsBuilder(
                    transitionType: SharedAxisTransitionType.horizontal,
                  ),
                  TargetPlatform.fuchsia: SharedAxisPageTransitionsBuilder(
                    transitionType: SharedAxisTransitionType.horizontal,
                  ),
                  TargetPlatform.iOS: SharedAxisPageTransitionsBuilder(
                    transitionType: SharedAxisTransitionType.horizontal,
                  ),
                  TargetPlatform.linux: SharedAxisPageTransitionsBuilder(
                    transitionType: SharedAxisTransitionType.horizontal,
                  ),
                  TargetPlatform.macOS: SharedAxisPageTransitionsBuilder(
                    transitionType: SharedAxisTransitionType.horizontal,
                  ),
                  TargetPlatform.windows: SharedAxisPageTransitionsBuilder(
                    transitionType: SharedAxisTransitionType.horizontal,
                  ),
                },
              ),
            ),
            home: FutureBuilder(
              future: AuthSerivce.isUserLoggedIn(),
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return const Center(
                    child: Text("Error!"),
                  );
                }

                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }

                if (snapshot.data == true) {
                  return const Center(
                    child: Text("Logged!"),
                  );
                }

                return const RegisterPage();
              },
            ),
          );
        });
  }
}
