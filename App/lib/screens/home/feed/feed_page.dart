import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:instagram/models/post.dart';
import 'package:instagram/models/user.dart';
import 'package:instagram/screens/home/components/post_tile.dart';
import 'package:instagram/screens/home/components/story_tile.dart';
import 'package:instagram/services/offline_db_service.dart';

class FeedPage extends StatefulWidget {
  const FeedPage({Key? key}) : super(key: key);

  @override
  _FeedPageState createState() => _FeedPageState();
}

class _FeedPageState extends State<FeedPage>
    with AutomaticKeepAliveClientMixin {
  late final ScrollController _postsScrollController;
  late final ScrollController _storiesscrollController;

  List<Post> posts = [];
  List<User> usersWithStories = [];

  @override
  void initState() {
    _postsScrollController = ScrollController();
    _storiesscrollController = ScrollController();

    usersWithStories = OfflineDBService.getUsersWithStories(6);
    posts = OfflineDBService.getPosts(3);

    _storiesscrollController.addListener(() async {
      if (_storiesscrollController.position.pixels ==
          _storiesscrollController.position.maxScrollExtent) {
        usersWithStories = OfflineDBService.getUsersWithStories(
          usersWithStories.length + 3,
        );
        setState(() {});
      }
    });

    _postsScrollController.addListener(() async {
      if (_postsScrollController.position.pixels ==
          _postsScrollController.position.maxScrollExtent) {
        posts = OfflineDBService.getPosts(posts.length + 3);
        setState(() {});
      }
    });

    super.initState();
  }

  @override
  void dispose() {
    _postsScrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Instagram",
          style: GoogleFonts.grandHotel(fontSize: 35),
        ),
        elevation: 0,
      ),
      body: ListView.builder(
        controller: _postsScrollController,
        scrollDirection: Axis.vertical,
        itemCount: posts.length + 1,
        itemBuilder: (context, index) => index == 0
            ? SizedBox(
                height: 100,
                child: ListView.builder(
                  controller: _storiesscrollController,
                  scrollDirection: Axis.horizontal,
                  itemCount: usersWithStories.length,
                  itemBuilder: (context, index) => StoryTile(
                    owner: usersWithStories[index],
                    visibleTitle: true,
                  ),
                ),
              )
            : PostTile(
                post: posts[index - 1],
              ),
      ),
    );
  }

  @override
  bool get wantKeepAlive => true;
}
