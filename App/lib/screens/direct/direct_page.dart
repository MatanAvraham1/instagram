// import 'package:flutter/material.dart';
// import 'package:instagram/screens/home/profile/profile_page.dart';
// import 'package:material_floating_search_bar/material_floating_search_bar.dart';

// class DirectPage extends StatefulWidget {
//   const DirectPage({Key? key}) : super(key: key);

//   @override
//   _DirectPageState createState() => _DirectPageState();
// }

// class _DirectPageState extends State<DirectPage>
//     with AutomaticKeepAliveClientMixin {
//   final FloatingSearchBarController floatingSearchBarController =
//       FloatingSearchBarController();

//   @override
//   void dispose() {
//     floatingSearchBarController.dispose();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     final isPortrait =
//         MediaQuery.of(context).orientation == Orientation.portrait;
//     String usernameToSearch = "";

//     super.build(context);
//     return Scaffold(
//       appBar: AppBar(
//         title: Text(connectedUser.username),
//         leading: const BackButton(),
//         actions: [
//           CircularButton(icon: const Icon(Icons.add), onPressed: () {})
//         ],
//       ),
//       body: FloatingSearchBar(
//         body: Column(
//           children: [
//             Container(
//               height: 200,
//               child: ListView.builder(
//                 scrollDirection: Axis.horizontal,
//                 itemCount: 5,
//                 itemBuilder: (context, index) => CircleAvatar(
//                   backgroundColor: Colors.accents[index],
//                   radius: 35,
//                 ),
//               ),
//             )
//           ],
//         ),
//         hint: 'Search...',
//         scrollPadding: const EdgeInsets.only(top: 16, bottom: 56),
//         transitionDuration: const Duration(milliseconds: 800),
//         transitionCurve: Curves.easeInOut,
//         physics: const BouncingScrollPhysics(),
//         axisAlignment: isPortrait ? 0.0 : -1.0,
//         openAxisAlignment: 0.0,
//         width: isPortrait ? 600 : 500,
//         debounceDelay: const Duration(milliseconds: 500),
//         onQueryChanged: (query) {},
//         // Specify a custom transition to be used for
//         // animating between opened and closed stated.
//         transition: CircularFloatingSearchBarTransition(),
//         actions: [
//           FloatingSearchBarAction.searchToClear(
//             showIfClosed: false,
//           ),
//         ],
//         leadingActions: [
//           FloatingSearchBarAction(
//             child: CircularButton(
//               icon: const Icon(Icons.search),
//               onPressed: () {
//                 floatingSearchBarController.open();
//               },
//             ),
//             showIfClosed: true,
//           ),
//           FloatingSearchBarAction.back(
//             showIfClosed: false,
//           ),
//         ],
//         builder: (context, transition) {
//           return ClipRRect(
//             borderRadius: BorderRadius.circular(8),
//             child: Material(
//               color: Colors.white,
//               elevation: 4.0,
//               child: Column(
//                 mainAxisSize: MainAxisSize.min,
//                 children: usernameToSearch.isEmpty
//                     ? const [
//                         ListTile(
//                           title: Text(
//                             "Enter username for results...",
//                             style: TextStyle(color: Colors.black),
//                           ),
//                         )
//                       ]
//                     : OfflineDBService.getUsersByUsername(usernameToSearch)
//                         .map((e) => ListTile(
//                               onTap: () {
//                                 Navigator.of(context).push(MaterialPageRoute(
//                                   builder: (context) => ProfilePage(user: e),
//                                 ));
//                               },
//                               title: Text(
//                                 e.username,
//                                 style: const TextStyle(color: Colors.black),
//                               ),
//                               leading: CircleAvatar(
//                                 backgroundImage: NetworkImage(e.photoUrl),
//                               ),
//                             ))
//                         .toList(),
//               ),
//             ),
//           );
//         },
//       ),
//     );
//   }

//   @override
//   bool get wantKeepAlive => true;
// }
