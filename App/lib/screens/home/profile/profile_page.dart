// import 'dart:math';
// import 'package:flutter/material.dart';
// import 'package:flutter_svg/flutter_svg.dart';
// import 'package:instagram/DB.dart';
// import 'package:instagram/classes/number_helper.dart';
// import 'package:instagram/screens/home/components/posts_page.dart';
// import 'package:material_floating_search_bar/material_floating_search_bar.dart';
// import 'package:instagram/models/user.dart';

// class ProfilePage extends StatefulWidget {
//   final AppUser user;
//   final bool inPageView; // If the page is in the page view of the home page
//   const ProfilePage({
//     Key? key,
//     required this.user,
//     this.inPageView = false,
//   }) : super(key: key);

//   @override
//   _ProfilePageState createState() => _ProfilePageState();
// }

// class _ProfilePageState extends State<ProfilePage> {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text(widget.user.username),
//         leadingWidth:
//             widget.user == connectedUser && widget.inPageView ? 16 : null,
//         leading: widget.user == connectedUser && widget.inPageView
//             ? const Padding(
//                 padding: EdgeInsets.only(left: 10),
//                 child: Icon(
//                   Icons.lock_outline_rounded,
//                   size: 20,
//                 ),
//               )
//             : null,
//         actions: widget.user == connectedUser && widget.inPageView
//             ? [
//                 CircularButton(
//                   onPressed: () {},
//                   icon: SvgPicture.asset(
//                     "assets/images/add_outlined.svg",
//                     color: Theme.of(context).iconTheme.color,
//                     width: 22,
//                   ),
//                 ),
//                 CircularButton(onPressed: () {}, icon: const Icon(Icons.menu))
//               ]
//             : [
//                 CircularButton(
//                   onPressed: () {},
//                   icon: const Icon(Icons.notifications_outlined),
//                 ),
//                 CircularButton(
//                     onPressed: () {}, icon: const Icon(Icons.more_vert))
//               ],
//       ),
//       body: Padding(
//         padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
//         child: ListView(
//           children: [
//             _buildInfo(),
//             _buildButtonsBar(),
//             _buildHighliglts(context),
//             _buildPostsGridView()
//           ],
//         ),
//       ),
//     );
//   }

//   Column _buildPostsGridView() {
//     return Column(
//       children: [
//         const SizedBox(
//           height: 25,
//         ),
//         DefaultTabController(
//           length: 2,
//           initialIndex: 0,
//           child: Column(
//             children: [
//               const TabBar(tabs: [
//                 Tab(
//                   icon: Icon(Icons.table_rows_sharp),
//                 ),
//                 Tab(
//                   icon: Icon(Icons.tag),
//                 )
//               ]),
//               SizedBox(
//                 height: 350,
//                 child: TabBarView(children: [
//                   GridView.count(
//                     crossAxisCount: 3,
//                     children: List.generate(
//                         widget.user.posts.length,
//                         (index) => InkWell(
//                               onTap: () {
//                                 Navigator.of(context).push(MaterialPageRoute(
//                                   builder: (context) =>
//                                       PostsPage(posts: widget.user.posts),
//                                 ));
//                               },
//                               child: Container(
//                                 decoration: BoxDecoration(
//                                     image: DecorationImage(
//                                         fit: BoxFit.cover,
//                                         image: NetworkImage(widget.user
//                                             .posts[index].imagesUrl.first))),
//                               ),
//                             )),
//                   ),
//                   GridView.count(
//                     crossAxisCount: 3,
//                     children: List.generate(
//                         20,
//                         (index) => Container(
//                               color: Colors.accents[
//                                   Random().nextInt(Colors.accents.length)],
//                             )),
//                   ),
//                 ]),
//               ),
//             ],
//           ),
//         ),
//       ],
//     );
//   }

//   Column _buildHighliglts(BuildContext context) {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         const SizedBox(
//           height: 15,
//         ),
//         if (widget.user == connectedUser)
//           Column(
//             children: const [
//               Text(
//                 "Story Highlighlts",
//                 style: TextStyle(fontWeight: FontWeight.w600),
//               ),
//               SizedBox(
//                 height: 4,
//               ),
//               Text(
//                 "Keep your favorite stories on your profile",
//               ),
//               SizedBox(
//                 height: 15,
//               ),
//             ],
//           ),
//         SingleChildScrollView(
//           scrollDirection: Axis.horizontal,
//           child: Row(
//             children: List.generate(
//                 10,
//                 (index) => Padding(
//                       padding: const EdgeInsets.only(right: 25.0),
//                       child: Container(
//                         child: index > 0
//                             ? null
//                             : const Center(
//                                 child: Icon(
//                                   Icons.add,
//                                   size: 30,
//                                 ),
//                               ),
//                         height: 60,
//                         width: 60,
//                         decoration: BoxDecoration(
//                           shape: BoxShape.circle,
//                           color: index > 0
//                               ? Theme.of(context).canvasColor
//                               : Theme.of(context).scaffoldBackgroundColor,
//                           border: index > 0
//                               ? null
//                               : Border.all(
//                                   width: 1.2,
//                                   color: Theme.of(context).iconTheme.color!),
//                         ),
//                       ),
//                     )),
//           ),
//         ),
//       ],
//     );
//   }

//   Widget _buildButtonsBar() {
//     return Column(
//       children: [
//         const SizedBox(height: 30),
//         Row(
//           children: widget.user == connectedUser
//               ? [
//                   Expanded(
//                     flex: 10,
//                     child: OutlinedButton(
//                       onPressed: () {},
//                       child: const Text(
//                         "Edit Profile",
//                         style: TextStyle(color: Colors.white),
//                       ),
//                       style: OutlinedButton.styleFrom(
//                         side: const BorderSide(width: 0.3, color: Colors.white),
//                       ),
//                     ),
//                   ),
//                   const SizedBox(
//                     width: 5,
//                   ),
//                   Expanded(
//                     flex: 1,
//                     child: OutlinedButton(
//                       onPressed: () {},
//                       child: const Icon(
//                         Icons.arrow_drop_down,
//                         size: 20,
//                         color: Colors.white,
//                       ),
//                       style: OutlinedButton.styleFrom(
//                           side:
//                               const BorderSide(width: 0.3, color: Colors.white),
//                           padding: EdgeInsets.zero),
//                     ),
//                   ),
//                 ]
//               : [
//                   Expanded(
//                     flex: 5,
//                     child: OutlinedButton(
//                       onPressed: () {},
//                       child: const Text(
//                         "Follow",
//                         style: TextStyle(color: Colors.white),
//                       ),
//                       style: OutlinedButton.styleFrom(
//                           side:
//                               const BorderSide(width: 0.3, color: Colors.white),
//                           padding: EdgeInsets.zero),
//                     ),
//                   ),
//                   const SizedBox(
//                     width: 7,
//                   ),
//                   Expanded(
//                     flex: 5,
//                     child: OutlinedButton(
//                       onPressed: () {},
//                       child: const Text(
//                         "Message",
//                         style: TextStyle(color: Colors.white),
//                       ),
//                       style: OutlinedButton.styleFrom(
//                           side:
//                               const BorderSide(width: 0.3, color: Colors.white),
//                           padding: EdgeInsets.zero),
//                     ),
//                   ),
//                   const SizedBox(
//                     width: 5,
//                   ),
//                   Expanded(
//                     flex: 1,
//                     child: OutlinedButton(
//                       onPressed: () {},
//                       child: const Icon(
//                         Icons.arrow_drop_down,
//                         size: 20,
//                         color: Colors.white,
//                       ),
//                       style: OutlinedButton.styleFrom(
//                           side:
//                               const BorderSide(width: 0.3, color: Colors.white),
//                           padding: EdgeInsets.zero),
//                     ),
//                   ),
//                 ],
//         ),
//       ],
//     );
//   }

//   Widget _buildInfo() {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Row(
//           mainAxisAlignment: MainAxisAlignment.spaceAround,
//           children: [
//             CircleAvatar(
//               radius: 40,
//               backgroundImage: NetworkImage(widget.user.photoUrl),
//             ),
//             Column(
//               crossAxisAlignment: CrossAxisAlignment.center,
//               children: [
//                 Text(
//                   NumberHelper.getShortNumber(widget.user.posts.length),
//                   style: const TextStyle(
//                       fontSize: 16, fontWeight: FontWeight.bold),
//                 ),
//                 const SizedBox(height: 3),
//                 const Text(
//                   'Posts',
//                   style: TextStyle(fontSize: 16),
//                 ),
//               ],
//             ),
//             Column(
//               crossAxisAlignment: CrossAxisAlignment.center,
//               children: [
//                 Text(
//                   NumberHelper.getShortNumber(widget.user.following),
//                   style: const TextStyle(
//                       fontSize: 16, fontWeight: FontWeight.bold),
//                 ),
//                 const SizedBox(height: 3),
//                 const Text(
//                   'Following',
//                   style: TextStyle(fontSize: 16),
//                 ),
//               ],
//             ),
//             Column(
//               crossAxisAlignment: CrossAxisAlignment.center,
//               children: [
//                 Text(
//                   NumberHelper.getShortNumber(widget.user.followers),
//                   style: const TextStyle(
//                       fontSize: 16, fontWeight: FontWeight.bold),
//                 ),
//                 const SizedBox(height: 3),
//                 const Text(
//                   'Followers',
//                   style: TextStyle(fontSize: 16),
//                 ),
//               ],
//             ),
//           ],
//         ),
//         Padding(
//           padding: const EdgeInsets.only(left: 16, top: 10),
//           child: Text(
//             widget.user.fullName,
//             style: const TextStyle(
//               fontWeight: FontWeight.w600,
//               fontSize: 14,
//             ),
//           ),
//         ),
//       ],
//     );
//   }
// }
