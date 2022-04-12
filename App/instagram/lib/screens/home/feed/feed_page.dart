import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:instagram/models/post_model.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/home/components/loading_indicator.dart';
import 'package:instagram/screens/home/components/post_tile.dart';
import 'package:instagram/screens/home/components/story_tile.dart';
import 'package:instagram/services/online_db_service.dart';

class FeedPage extends StatefulWidget {
  const FeedPage({Key? key}) : super(key: key);

  @override
  _FeedPageState createState() => _FeedPageState();
}

class _FeedPageState extends State<FeedPage>
    with AutomaticKeepAliveClientMixin {
  late final ScrollController _postsScrollController;
  late final ScrollController _usersWithStoriesScrollController;

  bool _isLoadingStories = false;
  bool _isLoadingMoreStories = false;

  bool _isLoadingPosts = false;
  bool _isLoadingMorePosts = false;

  List<User> usersWithStories = [];
  List<Post> posts = [];

  Future loadUsersWithStories() async {
    setState(() {
      _isLoadingStories = true;
    });
    usersWithStories = await OnlineDBService.whichOfMyFollowingPublishedStories(
        usersWithStories.length);
    setState(() {
      _isLoadingStories = false;
    });
  }

  void loadMoreUsersWithStories() {
    _usersWithStoriesScrollController.addListener(() async {
      if (_isLoadingMoreStories) {
        return;
      }
      if (_usersWithStoriesScrollController.position.extentAfter < 500) {
        setState(() {
          _isLoadingMoreStories = true;
        });
        usersWithStories.addAll(
            await OnlineDBService.whichOfMyFollowingPublishedStories(
                usersWithStories.length));
        setState(() {
          _isLoadingMoreStories = false;
        });
      }
    });
  }

  Future loadPosts() async {
    setState(() {
      _isLoadingPosts = true;
    });
    posts = await OnlineDBService.getFeedPosts(posts.length);
    setState(() {
      _isLoadingPosts = false;
    });
  }

  void loadMorePosts() {
    _postsScrollController.addListener(() async {
      if (_isLoadingMorePosts) {
        return;
      }
      if (_postsScrollController.position.extentAfter < 500) {
        setState(() {
          _isLoadingMorePosts = true;
        });
        posts.addAll(await OnlineDBService.getFeedPosts(posts.length));
        setState(() {
          _isLoadingMorePosts = false;
        });
      }
    });
  }

  @override
  void initState() {
    _postsScrollController = ScrollController();
    _usersWithStoriesScrollController = ScrollController();

    loadUsersWithStories();
    loadMoreUsersWithStories();

    loadPosts();
    loadMorePosts();

    super.initState();
  }

  @override
  void dispose() {
    _usersWithStoriesScrollController.dispose();
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
      body: _isLoadingStories || _isLoadingPosts
          ? const LoadingIndicator(
              title: "Loading data",
            )
          : RefreshIndicator(
              onRefresh: () async {
                await loadPosts();
                await loadUsersWithStories();
              },
              child: ListView.builder(
                  controller: _postsScrollController,
                  scrollDirection: Axis.vertical,
                  itemCount: posts.length + 2,
                  itemBuilder: (context, index) => index == 0
                      ? SizedBox(
                          height: 100,
                          child: ListView.builder(
                            controller: _usersWithStoriesScrollController,
                            scrollDirection: Axis.horizontal,
                            itemCount: usersWithStories.length + 1,
                            itemBuilder: (context, index) =>
                                index == usersWithStories.length
                                    ? _isLoadingMoreStories
                                        ? const LoadingIndicator(
                                            title: "Loading stories",
                                          )
                                        : Container()
                                    : StoryTile(
                                        owner: usersWithStories[index],
                                        visibleTitle: true,
                                      ),
                          ),
                        )
                      : index == posts.length + 1
                          ? _isLoadingMorePosts
                              ? const LoadingIndicator(
                                  title: "Loading posts",
                                )
                              : Container()
                          : PostTile(
                              post: posts[index - 1],
                            )),
            ),
    );
  }

  @override
  bool get wantKeepAlive => true;
}
