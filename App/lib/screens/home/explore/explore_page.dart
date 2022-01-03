// import 'dart:math';

// import 'package:flutter/material.dart';
// import 'package:instagram/screens/home/profile/profile_page.dart';
// import 'package:instagram/services/offline_db_service.dart';
// import 'package:material_floating_search_bar/material_floating_search_bar.dart';

// class ExplorePage extends StatefulWidget {
//   const ExplorePage({Key? key}) : super(key: key);

//   @override
//   _ExplorePageState createState() => _ExplorePageState();
// }

// class _ExplorePageState extends State<ExplorePage> {
//   final FloatingSearchBarController floatingSearchBarController =
//       FloatingSearchBarController();

//   String usernameToSearch = "";

//   @override
//   void dispose() {
//     floatingSearchBarController.dispose();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     final isPortrait =
//         MediaQuery.of(context).orientation == Orientation.portrait;

//     return FloatingSearchBar(
//       controller: floatingSearchBarController,
//       body: GridView.count(
//         crossAxisCount: 3,
//         children: List.generate(
//             30,
//             (index) => Container(
//                   color:
//                       Colors.accents[Random().nextInt(Colors.accents.length)],
//                 )),
//       ),

//       hint: 'Search...',
//       scrollPadding: const EdgeInsets.only(top: 16, bottom: 56),
//       transitionDuration: const Duration(milliseconds: 800),
//       transitionCurve: Curves.easeInOut,
//       physics: const BouncingScrollPhysics(),
//       axisAlignment: isPortrait ? 0.0 : -1.0,
//       openAxisAlignment: 0.0,
//       width: isPortrait ? 600 : 500,
//       debounceDelay: const Duration(milliseconds: 500),
//       onQueryChanged: (query) {
//         setState(() {
//           usernameToSearch = query;
//         });
//       },
//       // Specify a custom transition to be used for
//       // animating between opened and closed stated.
//       transition: CircularFloatingSearchBarTransition(),
//       actions: [
//         FloatingSearchBarAction.searchToClear(
//           showIfClosed: false,
//         ),
//       ],
//       leadingActions: [
//         FloatingSearchBarAction(
//           child: CircularButton(
//             icon: const Icon(Icons.search),
//             onPressed: () {
//               floatingSearchBarController.open();
//             },
//           ),
//           showIfClosed: true,
//         ),
//         FloatingSearchBarAction.back(
//           showIfClosed: false,
//         ),
//       ],
//       builder: (context, transition) {
//         return ClipRRect(
//           borderRadius: BorderRadius.circular(8),
//           child: Material(
//             color: Colors.white,
//             elevation: 4.0,
//             child: Column(
//               mainAxisSize: MainAxisSize.min,
//               children: usernameToSearch.isEmpty
//                   ? const [
//                       ListTile(
//                         title: Text(
//                           "Enter username for results...",
//                           style: TextStyle(color: Colors.black),
//                         ),
//                       )
//                     ]
//                   : OfflineDBService.getUsersByUsername(usernameToSearch)
//                       .map((e) => ListTile(
//                             onTap: () {
//                               Navigator.of(context).push(MaterialPageRoute(
//                                 builder: (context) => ProfilePage(user: e),
//                               ));
//                             },
//                             title: Text(
//                               e.username,
//                               style: const TextStyle(color: Colors.black),
//                             ),
//                             leading: CircleAvatar(
//                               backgroundImage: NetworkImage(e.photoUrl),
//                             ),
//                           ))
//                       .toList(),
//             ),
//           ),
//         );
//       },
//     );
//   }
// }
