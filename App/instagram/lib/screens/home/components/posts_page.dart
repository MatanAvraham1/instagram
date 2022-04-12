import 'package:flutter/material.dart';

import 'package:instagram/models/post_model.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/home/components/post_tile.dart';
import 'package:scrollable_positioned_list/scrollable_positioned_list.dart';

class PostsPage extends StatefulWidget {
  final User owner;
  final List<Post> posts;
  final int initialPostIndex;
  const PostsPage({
    Key? key,
    required this.owner,
    required this.posts,
    required this.initialPostIndex,
  }) : super(key: key);

  @override
  State<PostsPage> createState() => _PostsPageState();
}

class _PostsPageState extends State<PostsPage> {
  final ItemScrollController itemScrollController = ItemScrollController();

  @override
  void initState() {
    WidgetsBinding.instance!.addPostFrameCallback((timeStamp) {
      itemScrollController.jumpTo(index: widget.initialPostIndex + 1);
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ScrollablePositionedList.builder(
        itemScrollController: itemScrollController,
        itemCount: widget.posts.length + 1,
        itemBuilder: (context, index) => index == 0
            ? AppBar(
                title: const Text(
                  "Posts",
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              )
            : PostTile(
                post: widget.posts[index - 1],
              ),
      ),
    );
  }
}
