// import 'package:flutter/material.dart';
// import 'package:instagram/DB.dart';
// import 'package:instagram/models/post.dart';
// import 'package:instagram/models/user.dart';
// import 'package:instagram/screens/home/components/comment_tile.dart';
// import 'package:instagram/models/comment.dart';
// import 'package:instagram/services/offline_db_service.dart';

// class CommentsPage extends StatefulWidget {
//   final Post post;

//   const CommentsPage({
//     Key? key,
//     required this.post,
//   }) : super(key: key);

//   @override
//   State<CommentsPage> createState() => _CommentsPageState();
// }

// class _CommentsPageState extends State<CommentsPage> {
//   late final ScrollController _scrollController;

//   int commentsToShow = 10;

//   @override
//   void initState() {
//     _scrollController = ScrollController();

//     _scrollController.addListener(() async {
//       if (_scrollController.position.pixels >=
//           _scrollController.position.maxScrollExtent - 200) {
//         setState(() {
//           commentsToShow += 5;
//         });
//       }
//     });

//     super.initState();
//   }

//   @override
//   void dispose() {
//     _scrollController.dispose();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text("Comments"),
//       ),
//       body: ListView.builder(
//         controller: _scrollController,
//         itemCount: widget.post.ownerComment.isNotEmpty
//             ? (commentsToShow > widget.post.comments.length
//                     ? widget.post.comments.length
//                     : commentsToShow) +
//                 1
//             : (commentsToShow > widget.post.comments.length
//                 ? widget.post.comments.length
//                 : commentsToShow),
//         itemBuilder: (context, index) {
//           late final Comment comment;
//           late final AppUser commentOwner;

//           if (widget.post.ownerComment.isNotEmpty && index == 0) {
//             commentOwner = OfflineDBService.getUserByUid(widget.post.ownerUid);
//             comment = Comment(
//                 comment: widget.post.ownerComment,
//                 publishedAt: widget.post.publishedAt,
//                 postUid: widget.post.postUid,
//                 ownerUid: widget.post.ownerUid,
//                 likes: 0);
//           } else {
//             commentOwner = users
//                 .where((element) =>
//                     element.uid == widget.post.comments[index - 1].ownerUid)
//                 .first;
//             comment = widget.post.comments[index - 1];
//           }

//           return CommentTile(
//             commentOwner: commentOwner,
//             comment: comment,
//             post: widget.post,
//             isFirstCommentInList: index == 0,
//           );
//         },
//       ),
//     );
//   }
// }
