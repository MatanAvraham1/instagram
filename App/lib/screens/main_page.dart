// import 'package:flutter/material.dart';
// import 'package:instagram/screens/camera/camera_page.dart';
// import 'package:instagram/screens/direct/direct_page.dart';
// import 'package:instagram/screens/home/home_page.dart';

// class MainPage extends StatefulWidget {
//   const MainPage({Key? key}) : super(key: key);

//   @override
//   _MainPageState createState() => _MainPageState();
// }

// class _MainPageState extends State<MainPage> {
//   final pages = const [DirectPage(), HomePage(), CameraPage()];
//   late final PageController pageController;

//   @override
//   void initState() {
//     pageController = PageController(initialPage: 1, keepPage: true);
//     super.initState();
//   }

//   @override
//   void dispose() {
//     pageController.dispose();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return WillPopScope(
//       onWillPop: () async {
//         if (pageController.page == 1) {
//           return true;
//         }

//         pageController.animateToPage(1,
//             duration: const Duration(milliseconds: 450), curve: Curves.ease);
//         return false;
//       },
//       child: PageView(
//         controller: pageController,
//         children: pages,
//       ),
//     );
//   }
// }
