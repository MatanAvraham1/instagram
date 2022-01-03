// import 'package:flutter/gestures.dart';
// import 'package:flutter/material.dart';
// import 'package:instagram/classes/number_helper.dart';
// import 'package:instagram/models/comment.dart';
// import 'package:instagram/models/post.dart';
// import 'package:instagram/models/user.dart';
// import 'package:instagram/screens/home/components/story_tile.dart';
// import 'package:instagram/screens/home/profile/profile_page.dart';
// import 'package:like_button/like_button.dart';

// class CommentTile extends StatelessWidget {
//   const CommentTile({
//     Key? key,
//     required this.commentOwner,
//     required this.comment,
//     required this.post,
//     this.isFirstCommentInList = false,
//   }) : super(key: key);

//   final AppUser commentOwner;
//   final Comment comment;
//   final Post post;
//   final bool isFirstCommentInList;

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       children: [
//         ListTile(
//           leading: SizedBox(
//               height: 45,
//               width: 45,
//               child: FittedBox(
//                   child: StoryTile(
//                 owner: commentOwner,
//                 playSingleStory: true,
//               ))),
//           title: RichText(
//             text: TextSpan(
//               children: <TextSpan>[
//                 TextSpan(
//                     recognizer: TapGestureRecognizer()
//                       ..onTap = () {
//                         Navigator.of(context).push(MaterialPageRoute(
//                           builder: (context) => ProfilePage(user: commentOwner),
//                         ));
//                       },
//                     text: '${commentOwner.username} ',
//                     style: const TextStyle(fontWeight: FontWeight.bold)),
//                 TextSpan(text: comment.comment),
//               ],
//             ),
//           ),
//           subtitle: Padding(
//             padding: const EdgeInsets.only(top: 4),
//             child: Text(
//                 "${DateUtils.getDaysInMonth(comment.publishedAt.year, comment.publishedAt.month) - comment.publishedAt.day}d  Reply"),
//           ),
//           trailing: post.ownerComment.isNotEmpty && isFirstCommentInList
//               ? null
//               : SizedBox(
//                   width: 40,
//                   child: LikeButton(
//                     size: 15,
//                     likeCount: comment.likes,
//                     likeCountAnimationType: LikeCountAnimationType.all,
//                     countPostion: CountPostion.bottom,
//                     countBuilder: (likeCount, isLiked, text) => Text(
//                         NumberHelper.getShortNumber(likeCount!),
//                         style:
//                             const TextStyle(color: Colors.grey, fontSize: 12)),
//                   )),
//         ),
//         if (post.ownerComment.isNotEmpty && isFirstCommentInList)
//           const Padding(
//             padding: EdgeInsets.symmetric(horizontal: 20.0),
//             child: Divider(
//               height: 20,
//               color: Colors.white,
//             ),
//           ),
//         const SizedBox(
//           height: 10,
//         ),
//       ],
//     );
//   }
// }
