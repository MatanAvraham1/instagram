// import 'package:flutter/material.dart';
// import 'package:instagram/models/post.dart';
// import 'package:instagram/screens/home/components/post_tile.dart';

// class PostsPage extends StatelessWidget {
//   final List<Post> posts;
//   const PostsPage({Key? key, required this.posts}) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: ListView.builder(
//         itemCount: posts.length + 1,
//         itemBuilder: (context, index) => index == 0
//             ? AppBar(
//                 title: const Text(
//                   "Posts",
//                   style: TextStyle(fontWeight: FontWeight.bold),
//                 ),
//               )
//             : PostTile(post: posts[index - 1]),
//       ),
//     );
//   }
// }
