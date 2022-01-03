// import 'dart:math';

// import 'package:flutter/gestures.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter_svg/flutter_svg.dart';
// import 'package:instagram/classes/number_helper.dart';
// import 'package:instagram/models/user.dart';
// import 'package:instagram/screens/home/components/story_tile.dart';
// import 'package:instagram/screens/home/profile/profile_page.dart';
// import 'package:like_button/like_button.dart';

// import 'package:instagram/models/post.dart';
// import 'package:instagram/screens/home/components/comments_page.dart';
// import 'package:material_floating_search_bar/material_floating_search_bar.dart';

// class PostTile extends StatefulWidget {
//   final Post post;
//   const PostTile({
//     Key? key,
//     required this.post,
//   }) : super(key: key);

//   @override
//   State<PostTile> createState() => _PostTileState();
// }

// class _PostTileState extends State<PostTile> {
//   late final User owner;

//   @override
//   void initState() {
//     super.initState();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Padding(
//       padding: const EdgeInsets.only(bottom: 5),
//       child: Column(
//         children: [
//           _buildTop(),
//           _buildImage(),
//           Padding(
//             padding: const EdgeInsets.only(left: 12, right: 12),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 _buildButtonsBar(),
//                 _buildLikedRow(),
//                 if (widget.post.ownerComment.isNotEmpty) _buildOwnerComment(),
//                 if (widget.post.comments.isNotEmpty) _buildPreviewComments(),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   InkWell _buildTop() {
//     return InkWell(
//       onTap: () {
//         Navigator.of(context).push(MaterialPageRoute(
//           builder: (context) => ProfilePage(user: owner),
//         ));
//       },
//       child: Container(
//         height: 50,
//         color: Theme.of(context).scaffoldBackgroundColor,
//         child: Row(
//           mainAxisAlignment: MainAxisAlignment.spaceBetween,
//           children: [
//             Row(
//               children: [
//                 const SizedBox(
//                   width: 4,
//                 ),
//                 SizedBox(
//                   height: 38,
//                   width: 38,
//                   child: FittedBox(
//                     child: StoryTile(
//                       owner: owner,
//                       playSingleStory: true,
//                     ),
//                   ),
//                 ),
//                 const SizedBox(
//                   width: 7,
//                 ),
//                 Column(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Text(
//                       owner.username,
//                       style: const TextStyle(fontSize: 14),
//                     ),
//                     const Text(
//                       "<location>",
//                       style: TextStyle(fontSize: 12),
//                     ),
//                   ],
//                 )
//               ],
//             ),
//             CircularButton(
//                 onPressed: () {
//                   showModalBottomSheet(
//                     context: context,
//                     builder: (context) => Container(),
//                   );
//                 },
//                 icon: const Icon(Icons.more_vert)),
//           ],
//         ),
//       ),
//     );
//   }

//   Container _buildImage() {
//     return Container(
//       height: 450,
//       decoration: BoxDecoration(
//         image: DecorationImage(
//             image: NetworkImage(widget.post.imagesUrl.first),
//             fit: BoxFit.cover),
//       ),
//     );
//   }

//   Container _buildButtonsBar() {
//     return Container(
//       height: 50,
//       color: Theme.of(context).scaffoldBackgroundColor,
//       child: Row(
//         children: [
//           const LikeButton(
//             size: 26,
//           ),
//           GestureDetector(
//             onTap: () {
//               Navigator.of(context).push(MaterialPageRoute(
//                 builder: (context) => CommentsPage(
//                   post: widget.post,
//                 ),
//               ));
//             },
//             child: Padding(
//               padding: const EdgeInsets.all(12.0),
//               child: SvgPicture.asset(
//                 "assets/images/comment_outlined.svg",
//                 color: Theme.of(context)
//                     .bottomNavigationBarTheme
//                     .unselectedItemColor,
//                 width: 20,
//               ),
//             ),
//           ),
//           GestureDetector(
//             onTap: () {
//               showModalBottomSheet(
//                 context: context,
//                 builder: (context) => Container(),
//               );
//             },
//             child: Padding(
//               padding: const EdgeInsets.all(12.0),
//               child: SvgPicture.asset(
//                 "assets/images/direct_outlined.svg",
//                 color: Theme.of(context)
//                     .bottomNavigationBarTheme
//                     .unselectedItemColor,
//                 width: 20,
//               ),
//             ),
//           )
//         ],
//       ),
//     );
//   }

//   Row _buildLikedRow() {
//     return Row(
//       children: [
//         CircleAvatar(
//           radius: 9,
//           backgroundColor:
//               Colors.accents[Random().nextInt(Colors.accents.length)],
//         ),
//         const SizedBox(
//           width: 3,
//         ),
//         RichText(
//           maxLines: 4,
//           text: TextSpan(
//             children: <TextSpan>[
//               const TextSpan(text: 'Liked by '),
//               const TextSpan(
//                   text: "mencchem_berger ",
//                   style: TextStyle(fontWeight: FontWeight.bold)),
//               const TextSpan(
//                 text: "and ",
//               ),
//               TextSpan(
//                   text:
//                       "${NumberHelper.getShortNumber(widget.post.likes - 1)} others",
//                   style: const TextStyle(fontWeight: FontWeight.bold))
//             ],
//           ),
//         ),
//       ],
//     );
//   }

//   Column _buildOwnerComment() {
//     return Column(
//       children: [
//         const SizedBox(
//           height: 3,
//         ),
//         _buildPreviewComment(owner, widget.post.ownerComment,
//             isOwnerComment: true)
//       ],
//     );
//   }

//   Widget _buildPreviewComments() {
//     int howMuchCommentsToShow = nextInt(
//         0, widget.post.comments.length <= 3 ? widget.post.comments.length : 3);

//     if (howMuchCommentsToShow == 0) {
//       return Container();
//     }

//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         const SizedBox(
//           height: 2,
//         ),
//         GestureDetector(
//           onTap: () {
//             Navigator.of(context).push(MaterialPageRoute(
//               builder: (context) => CommentsPage(
//                 post: widget.post,
//               ),
//             ));
//           },
//           child: Text(
//             "View all ${widget.post.comments.length} comments",
//             style: const TextStyle(color: Colors.grey),
//           ),
//         ),
//         const SizedBox(
//           height: 1,
//         ),
//         Column(
//           children: List.generate(
//             howMuchCommentsToShow,
//             (index) {
//               final commentOwner = OfflineDBService.getUserByUid(
//                   widget.post.comments[index].ownerUid);

//               return _buildPreviewComment(
//                   commentOwner, widget.post.comments[index].comment);
//             },
//           ),
//         ),
//       ],
//     );
//   }

//   Padding _buildPreviewComment(AppUser owner, String comment,
//       {bool isOwnerComment = false}) {
//     return Padding(
//       padding: const EdgeInsets.only(top: 1, bottom: 1),
//       child: RichText(
//         maxLines: isOwnerComment ? 4 : 2,
//         text: TextSpan(
//           children: <TextSpan>[
//             TextSpan(
//                 recognizer: TapGestureRecognizer()
//                   ..onTap = () {
//                     Navigator.of(context).push(MaterialPageRoute(
//                       builder: (context) => ProfilePage(user: owner),
//                     ));
//                   },
//                 text: '${owner.username} ',
//                 style: const TextStyle(fontWeight: FontWeight.bold)),
//             TextSpan(text: comment),
//           ],
//         ),
//       ),
//     );
//   }
// }
