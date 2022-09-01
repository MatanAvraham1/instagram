import 'package:flutter/material.dart';

import 'package:instagram/models/post_model.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/home/components/post_tile.dart';
import 'package:scrollable_positioned_list/scrollable_positioned_list.dart';

class PostsPage extends StatefulWidget {
  final User publisher;
  final List<Post> posts;
  final int initialPostIndex;
  const PostsPage({
    Key? key,
    required this.publisher,
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
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      itemScrollController.jumpTo(index: widget.initialPostIndex + 1);
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size(double.infinity, kToolbarHeight),
        child: SafeArea(
          child: Container(
            height: kToolbarHeight,
            color: Theme.of(context).primaryColor,
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 700),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: const [
                    BackButton(
                      color: Colors.white,
                    ),
                    SizedBox(
                      width: 15,
                    ),
                    Text(
                      "Posts",
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          fontSize: 20),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 700),
          child: ScrollablePositionedList.builder(
            itemScrollController: itemScrollController,
            itemCount: widget.posts.length,
            itemBuilder: (context, index) => PostTile(
              publisher: widget.publisher,
              post: widget.posts[index],
            ),
          ),
        ),
      ),
    );

    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 700),
          child: ScrollablePositionedList.builder(
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
                    publisher: widget.publisher,
                    post: widget.posts[index - 1],
                  ),
          ),
        ),
      ),
    );
  }
}
