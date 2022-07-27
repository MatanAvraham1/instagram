import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:instagram/classes/navigator_keys.dart';
import 'package:instagram/screens/initial_loading_screen.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(
    Provider<NavigatorKeys>(
      create: (context) => NavigatorKeys(),
      builder: (context, child) => const MyApp(),
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return AdaptiveTheme(
        initial: AdaptiveThemeMode.light,
        light: ThemeData(
          bottomNavigationBarTheme: const BottomNavigationBarThemeData(
            backgroundColor: Colors.white,
            selectedItemColor: Colors.blue,
            unselectedItemColor: Colors.white,
            selectedIconTheme: IconThemeData(color: Colors.white),
            unselectedIconTheme: IconThemeData(color: Colors.grey),
          ),
        ),
        dark: ThemeData(
          appBarTheme: const AppBarTheme(backgroundColor: Colors.black),
          scaffoldBackgroundColor: Colors.black,
          brightness: Brightness.dark,
          bottomNavigationBarTheme: BottomNavigationBarThemeData(
            backgroundColor: Colors.black,
            selectedItemColor: Colors.grey[850],
            unselectedItemColor: Colors.black,
            selectedIconTheme: const IconThemeData(color: Colors.white),
            unselectedIconTheme: const IconThemeData(color: Colors.white60),
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
        builder: (context, theme) {
          return MaterialApp(
            title: "Instagram",
            theme: theme,
            home: const InitialLoadingScreen(),
          );
        });
  }
}
