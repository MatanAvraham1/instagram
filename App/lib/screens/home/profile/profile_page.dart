import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:material_floating_search_bar/material_floating_search_bar.dart';

import 'package:instagram/classes/number_helper.dart';
import 'package:instagram/models/post.dart';
import 'package:instagram/models/user.dart';
import 'package:instagram/screens/auth/components/custom_alert_dialog.dart';
import 'package:instagram/screens/auth/components/custom_button.dart';
import 'package:instagram/screens/home/components/loading_indicator.dart';
import 'package:instagram/screens/home/components/posts_page.dart';
import 'package:instagram/screens/home/components/story_tile.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:instagram/services/online_db_service.dart';

class ProfilePage extends StatefulWidget {
  final User user;
  final bool inPageView; // If the page is in the page view of the home page
  const ProfilePage({
    Key? key,
    required this.user,
    this.inPageView = false,
  }) : super(key: key);

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage>
    with AutomaticKeepAliveClientMixin {
  User connectedUser = AuthSerivce.connectedUser!;
  List<User> followers = [];
  List<User> followings = [];
  List<Post> posts = [];
  final ScrollController _postsScrollController = ScrollController();

  bool _isLoadingPosts = false;
  bool _isLoadingMorePosts = false;

  late User user;

  @override
  void initState() {
    user = widget.user;

    loadPosts();
    loadMorePosts();

    super.initState();
  }

  @override
  void dispose() {
    _postsScrollController.dispose();
    super.dispose();
  }

  Future loadPosts() async {
    if (user.isPrivate && !user.isFollowedByMe) {
      return;
    } else {
      posts = await OnlineDBService.getPosts(user.id, posts.length,
          includePublisherInResponse: false);
      setState(() {
        _isLoadingPosts = false;
      });
    }
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
        posts.addAll(await OnlineDBService.getPosts(user.id, posts.length));
        setState(() {
          _isLoadingMorePosts = false;
        });
      }
    });
  }

  Future sendFollowRequest() async {
    await OnlineDBService.followUser(user.id);
    setState(() {
      user.isRequestedByMe = true;
    });
  }

  Future deleteFollowingRequest() async {
    await OnlineDBService.deleteFollowingRequest(user.id);
    setState(() {
      user.isRequestedByMe = false;
    });
  }

  Future followUser() async {
    await OnlineDBService.followUser(user.id);
    setState(() {
      user.isFollowedByMe = true;
      AuthSerivce.connectedUser!.followings++;
    });
  }

  Future unfollowUser() async {
    await OnlineDBService.unfollowUser(user.id);

    setState(() {
      user.isFollowedByMe = false;
      AuthSerivce.connectedUser!.followings--;
      followings.removeWhere((element) => element.id == user.id);
    });
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(user.username),
        leadingWidth: user == connectedUser && widget.inPageView ? 16 : null,
        leading: user == connectedUser && widget.inPageView
            ? const Padding(
                padding: EdgeInsets.only(left: 10),
                child: Icon(
                  Icons.lock_outline_rounded,
                  size: 20,
                ),
              )
            : null,
        actions: user == connectedUser && widget.inPageView
            ? [
                CircularButton(
                  onPressed: () {},
                  icon: SvgPicture.asset(
                    "assets/images/add_outlined.svg",
                    color: Theme.of(context).iconTheme.color,
                    width: 22,
                  ),
                ),
                CircularButton(
                    onPressed: () async {
                      await AuthSerivce.signOut();
                    },
                    icon: const Icon(Icons.menu))
              ]
            : [
                CircularButton(
                  onPressed: () {},
                  icon: const Icon(Icons.notifications_outlined),
                ),
                CircularButton(
                    onPressed: () {}, icon: const Icon(Icons.more_vert))
              ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          followers = [];
          followings = [];
          posts = [];

          var lastUser = user;
          user = await OnlineDBService.getUserById(user.id);
          if (lastUser == connectedUser) {
            AuthSerivce.connectedUser = user;
            connectedUser = user;
          }

          await loadPosts();
          setState(() {});
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
          child: ListView(
            children: [
              _buildInfo(),
              _buildButtonsBar(),
              if (!user.isPrivate || (user.isPrivate && user.isFollowedByMe))
                Column(
                  children: [_buildHighliglts(context), _buildPostsGridView()],
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPostsGridView() {
    if (_isLoadingPosts) {
      return const Padding(
        padding: EdgeInsets.only(top: 70),
        child: LoadingIndicator(
          radius: 20,
          title: "Loading Posts",
          strokeWidth: 2,
        ),
      );
    }

    return Column(
      children: [
        const SizedBox(
          height: 25,
        ),
        DefaultTabController(
          length: 2,
          initialIndex: 0,
          child: Column(
            children: [
              const TabBar(tabs: [
                Tab(
                  icon: Icon(Icons.table_rows_sharp),
                ),
                Tab(
                  icon: Icon(Icons.tag),
                )
              ]),
              SizedBox(
                height: 350,
                child: TabBarView(children: [
                  GridView.count(
                    controller: _postsScrollController,
                    crossAxisCount: 3,
                    children: List.generate(
                        posts.length + 1,
                        (index) => index == posts.length
                            ? _isLoadingMorePosts
                                ? const LoadingIndicator(
                                    radius: 25,
                                    title: "Loading Posts",
                                    strokeWidth: 2,
                                  )
                                : Container()
                            : InkWell(
                                onTap: () {
                                  Navigator.of(context).push(MaterialPageRoute(
                                    builder: (context) => PostsPage(
                                      initialPostIndex: index,
                                      posts: posts,
                                      owner: user,
                                    ),
                                  ));
                                },
                                child: Container(
                                  decoration: BoxDecoration(
                                      image: DecorationImage(
                                          fit: BoxFit.cover,
                                          image: NetworkImage(
                                              posts[index].photosUrls.first))),
                                ),
                              )),
                  ),
                  GridView.count(
                    crossAxisCount: 3,
                    children: List.generate(
                        20,
                        (index) => Container(
                              color: Colors.accents[
                                  Random().nextInt(Colors.accents.length)],
                            )),
                  ),
                ]),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Column _buildHighliglts(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(
          height: 15,
        ),
        if (user == connectedUser)
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                "Story Highlighlts",
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              SizedBox(
                height: 4,
              ),
              Text(
                "Keep your favorite stories on your profile",
              ),
              SizedBox(
                height: 15,
              ),
            ],
          ),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: List.generate(
                10,
                (index) => Padding(
                      padding: const EdgeInsets.only(right: 25.0),
                      child: Container(
                        child: index > 0
                            ? null
                            : const Center(
                                child: Icon(
                                  Icons.add,
                                  size: 30,
                                ),
                              ),
                        height: 60,
                        width: 60,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: index > 0
                              ? Theme.of(context).canvasColor
                              : Theme.of(context).scaffoldBackgroundColor,
                          border: index > 0
                              ? null
                              : Border.all(
                                  width: 1.2,
                                  color: Theme.of(context).iconTheme.color!),
                        ),
                      ),
                    )),
          ),
        ),
      ],
    );
  }

  Widget _buildButtonsBar() {
    List<Widget> arrowButton = [
      const SizedBox(
        width: 5,
      ),
      Expanded(
        flex: 1,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: MaterialButton(
            padding: EdgeInsets.zero,
            onPressed: () {},
            shape: Border.all(color: Colors.white, width: 0.3),
            child: const Icon(
              Icons.arrow_drop_down,
              size: 20,
              color: Colors.white,
            ),
          ),
        ),
      ),
    ];
    late List<Widget> buttons;

    if (user == connectedUser) {
      buttons = [
        Expanded(
          flex: 10,
          child: CustomButton(
            expanded: true,
            isOutlined: true,
            enableWhen: () => true,
            borderRadius: 12,
            text: 'Edit Profile',
            onPressed: () async {},
          ),
        )
      ];
    } else {
      buttons = [
        Expanded(
          flex: 5,
          child: _buildFollowButon(),
        ),
        const SizedBox(
          width: 7,
        ),
        Expanded(
          flex: 5,
          child: CustomButton(
            strokeHeight: 20,
            borderRadius: 14,
            expanded: true,
            isOutlined: true,
            enableWhen: () => true,
            text: 'Message',
            onPressed: () async {},
          ),
        ),
      ];
    }

    return Column(
      children: [
        const SizedBox(height: 30),
        Row(children: [...buttons, ...arrowButton]),
      ],
    );
  }

  CustomButton _buildFollowButon() {
    return CustomButton(
        strokeHeight: 20,
        borderRadius: 14,
        expanded: true,
        enableWhen: () => true,
        isOutlined: user.isRequestedByMe ? true : user.isFollowedByMe,
        text: user.isRequestedByMe
            ? "Requested"
            : user.isFollowedByMe
                ? "Unfollow"
                : "Follow",
        onPressed: () async {
          if (user.isPrivate && !user.isRequestedByMe) {
            await sendFollowRequest();
            return;
          }
          if (user.isRequestedByMe) {
            await deleteFollowingRequest();
            return;
          }

          if (!user.isFollowedByMe) {
            await followUser();
            return;
          }

          if (user.isFollowedByMe) {
            await unfollowUser();
            return;
          }
        });
  }

  Widget _buildInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            SizedBox(height: 95, width: 95, child: StoryTile(owner: user)),
            // CircleAvatar(
            //   radius: 40,
            //   backgroundImage: NetworkImage(user.photoUrl.isNotEmpty
            //       ? user.photoUrl
            //       : "https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg"),
            // ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  NumberHelper.getShortNumber(user.posts),
                  style: const TextStyle(
                      fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 3),
                const Text(
                  'Posts',
                  style: TextStyle(fontSize: 16),
                ),
              ],
            ),
            _buildFollowings(),
            _buildFollowers(),
          ],
        ),
        Padding(
          padding: const EdgeInsets.only(left: 16, top: 10),
          child: Text(
            user.fullname,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
        ),
      ],
    );
  }

  InkWell _buildFollowers() {
    return InkWell(
      onTap: () {
        if (user.isPrivate && !user.isFollowedByMe) {
          showDialog(
            context: context,
            builder: (context) => const CustomAlertDialog(
              title: "Forbidden!",
              description: "You must follow this user to see his followers!",
              okButton: "Ok",
            ),
          );
          return;
        }

        showModalBottomSheet(
          context: context,
          builder: (context) {
            return FutureBuilder<List<User>>(
              future: OnlineDBService.getFollowers(user.id, followers.length),
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Text("Error ${snapshot.error}");
                }

                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const LoadingIndicator(
                    title: "Loading followers",
                    radius: 20,
                    strokeWidth: 2,
                  );
                }

                followers.addAll(snapshot.data!);
                return ListView.builder(
                  itemCount: followers.length,
                  itemBuilder: (context, index) => ListTile(
                    onTap: () {
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) =>
                            ProfilePage(user: followers[index]),
                      ));
                    },
                    leading: SizedBox(
                        height: 60,
                        width: 60,
                        child: StoryTile(owner: followers[index])),
                    title: Text(followers[index].username),
                    subtitle: Text(followers[index].fullname),
                  ),
                );
              },
            );
          },
        );
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            NumberHelper.getShortNumber(user.followers),
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 3),
          const Text(
            'Followers',
            style: TextStyle(fontSize: 16),
          ),
        ],
      ),
    );
  }

  InkWell _buildFollowings() {
    return InkWell(
      onTap: () {
        if (user.isPrivate && !user.isFollowedByMe) {
          showDialog(
            context: context,
            builder: (context) => const CustomAlertDialog(
              title: "Forbidden!",
              description: "You must follow this user to see his followings!",
              okButton: "Ok",
            ),
          );
          return;
        }

        showModalBottomSheet(
          context: context,
          builder: (context) {
            return FutureBuilder<List<User>>(
              future: OnlineDBService.getFollowings(user.id, followings.length),
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Text("Error ${snapshot.error}");
                }

                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const LoadingIndicator(
                    title: "Loading followings",
                    radius: 20,
                    strokeWidth: 2,
                  );
                }

                followings.addAll(snapshot.data!);
                return ListView.builder(
                  itemCount: followings.length,
                  itemBuilder: (context, index) => ListTile(
                    onTap: () {
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) =>
                            ProfilePage(user: followings[index]),
                      ));
                    },
                    leading: SizedBox(
                        height: 60,
                        width: 60,
                        child: StoryTile(owner: followings[index])),
                    title: Text(followings[index].username),
                    subtitle: Text(followings[index].fullname),
                  ),
                );
              },
            );
          },
        );
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            NumberHelper.getShortNumber(user.followings),
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 3),
          const Text(
            'Following',
            style: TextStyle(fontSize: 16),
          ),
        ],
      ),
    );
  }

  @override
  bool get wantKeepAlive => true;
}
