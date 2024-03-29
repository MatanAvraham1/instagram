import 'dart:math';

import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:instagram/presentation/my_flutter_app_icons.dart';
import 'package:instagram/screens/home/profile/add_post_screen.dart';
import 'package:instagram/services/friendships_service.dart';
import 'package:instagram/services/posts_db_service.dart';
import 'package:instagram/services/users_db_service.dart';
import 'package:instagram/themes/themes.dart';
import 'package:material_floating_search_bar/material_floating_search_bar.dart';

import 'package:instagram/classes/number_helper.dart';
import 'package:instagram/models/post_model.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/auth/components/custom_alert_dialog.dart';
import 'package:instagram/screens/auth/components/online_button.dart';
import 'package:instagram/screens/home/components/loading_indicator.dart';
import 'package:instagram/screens/home/components/posts_page.dart';
import 'package:instagram/screens/home/components/story_tile.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:responsive_builder/responsive_builder.dart';

class ProfilePage extends StatefulWidget {
  final User user;
  final bool inPageView; // If the page is in the page view of the home page
  const ProfilePage({
    Key? key,
    required this.user,
    this.inPageView = false,
  }) : super(key: key);

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage>
    with AutomaticKeepAliveClientMixin {
  User connectedUser = AuthService().connectedUser!;
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

    loadInitialPosts();
    listenToPostsListController();

    super.initState();
  }

  @override
  void dispose() {
    _postsScrollController.dispose();
    super.dispose();
  }

  Future loadInitialPosts() async {
    if (user.isPrivate && !user.isFollowedByMe) {
      return;
    } else {
      posts = await PostsDBService().getPostsByPublisherId(
        user.id,
        posts.length,
      );
      setState(() {
        _isLoadingPosts = false;
      });
    }
  }

  void listenToPostsListController() {
    /*
    Adds listener to the posts scroll controller to load more posts when we reach the bottom
    */
    _postsScrollController.addListener(() async {
      if (_isLoadingMorePosts) {
        return;
      }

      if (_postsScrollController.position.extentAfter < 500) {
        setState(() {
          _isLoadingMorePosts = true;
        });
        posts.addAll(await PostsDBService()
            .getPostsByPublisherId(user.id, posts.length));
        setState(() {
          _isLoadingMorePosts = false;
        });
      }
    });
  }

  Future sendFollowRequest() async {
    await FriendshipsService().followUser(user.id);
    setState(() {
      user.isRequestedByMe = true;
    });
  }

  Future deleteFollowingRequest() async {
    await FriendshipsService().deleteFollowingRequest(user.id);
    setState(() {
      user.isRequestedByMe = false;
    });
  }

  Future followUser() async {
    await FriendshipsService().followUser(user.id);
    setState(() {
      user.isFollowedByMe = true;
      user.followers++;
      AuthService().connectedUser!.followings++;
    });
  }

  Future unfollowUser() async {
    await FriendshipsService().unfollowUser(user.id);

    setState(() {
      user.isFollowedByMe = false;
      user.followers--;
      AuthService().connectedUser!.followings--;
      followers.removeWhere((element) => element.id == user.id);
    });
  }

  Widget _buildInfo() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        // SizedBox(height: 95, width: 20, child: StoryTile(owner: user)),

        // Avatar with full name
        Column(
          children: [
            CircleAvatar(
              radius: 40,
              backgroundImage: CachedNetworkImageProvider(user.profilePhoto,
                  headers: {
                    "Authorization": AuthService().getAuthorizationHeader()
                  }),
            ),
            const SizedBox(
              height: 13,
            ),
            Text(
              user.fullname,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
            ),
          ],
        ),

        // Posts followers and followings info
        Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              NumberHelper.getShortNumber(user.posts),
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
    );
  }

  Widget _buildButtonsBar() {
    List<Widget> arrowButton = [
      const SizedBox(width: 6),
      ConstrainedBox(
        constraints: const BoxConstraints(
          minHeight: 40,
          maxHeight: 40,
          minWidth: 40,
          maxWidth: 40,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: MaterialButton(
            padding: EdgeInsets.zero,
            onPressed: () {},
            shape: Border.all(
                color: Theme.of(context).iconTheme.color!, width: 0.3),
            child: Icon(
              Icons.arrow_drop_down,
              size: 20,
              color: Theme.of(context).iconTheme.color!,
            ),
          ),
        ),
      ),
    ];
    late List<Widget> buttons;

    if (user == connectedUser) {
      buttons = [
        ConstrainedBox(
          constraints: const BoxConstraints(
            minHeight: 40,
            maxHeight: 40,
            minWidth: 100,
            maxWidth: 500,
          ),
          child: SizedBox(
            width: MediaQuery.of(context).size.width * 0.8,
            child: OnlineButton(
              expanded: true,
              isOutlined: true,
              enableWhen: () => true,
              borderRadius: 6,
              text: 'Edit Profile',
              onPressed: () async {},
            ),
          ),
        )
      ];
    } else {
      buttons = [
        ConstrainedBox(
          constraints: const BoxConstraints(
            minHeight: 40,
            maxHeight: 40,
            minWidth: 150,
            maxWidth: 300,
          ),
          child: SizedBox(
            width: MediaQuery.of(context).size.width * 0.4,
            child: _buildFollowButon(),
          ),
        ),
        const SizedBox(
          width: 7,
        ),
        ConstrainedBox(
          constraints: const BoxConstraints(
            minHeight: 40,
            maxHeight: 40,
            minWidth: 150,
            maxWidth: 300,
          ),
          child: SizedBox(
            width: MediaQuery.of(context).size.width * 0.4,
            child: OnlineButton(
              strokeHeight: 20,
              borderRadius: 6,
              expanded: true,
              isOutlined: true,
              enableWhen: () => true,
              text: 'Message',
              onPressed: () async {},
            ),
          ),
        ),
      ];
    }

    return Column(
      children: [
        const SizedBox(height: 30),
        Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [...buttons, ...arrowButton]),
        const SizedBox(height: 20),
      ],
    );
  }

  OnlineButton _buildFollowButon() {
    return OnlineButton(
        textColor: !user.isFollowedByMe ? Colors.white : null,
        strokeHeight: 20,
        borderRadius: 6,
        expanded: true,
        enableWhen: () => true,
        isOutlined: user.isRequestedByMe ? true : user.isFollowedByMe,
        text: user.isRequestedByMe
            ? "Requested"
            : user.isFollowedByMe
                ? "Unfollow"
                : "Follow",
        onPressed: () async {
          await Future.delayed(
              const Duration(milliseconds: 250)); // For the animation...

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

  @override
  Widget build(BuildContext context) {
    super.build(context);

    return Scaffold(
      endDrawer: Drawer(
        child: ListView(
          children: [
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text("Log Out"),
              onTap: () async {
                await AuthService().signOut();
              },
            ),
            ListTile(
              leading: const Icon(Icons.nightlight_outlined),
              title: const Text("Toogle Theme Mode"),
              onTap: () {
                AdaptiveTheme.of(context).toggleThemeMode();
              },
            )
          ],
        ),
      ),
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
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        user == connectedUser && widget.inPageView
                            ? const Icon(
                                Icons.lock_outline,
                                color: Colors.white,
                              )
                            : const BackButton(
                                color: Colors.white,
                              ),
                        Text(
                          user.username,
                          style: const TextStyle(
                              color: Colors.white, fontSize: 16),
                        ),
                      ],
                    ),
                    user == connectedUser && widget.inPageView
                        ? Row(
                            children: [
                              CircularButton(
                                  onPressed: () {
                                    Navigator.of(context)
                                        .push(MaterialPageRoute(
                                      builder: (context) =>
                                          const AddPostScreen(),
                                    ));
                                  },
                                  icon: const Icon(
                                    // MyFlutterApp.add_outlined,
                                    Icons.add,
                                    color: Colors.white,
                                    // size: 9,
                                  )),
                              Builder(builder: (context) {
                                return CircularButton(
                                    onPressed: () {
                                      // AdaptiveTheme.of(context)
                                      //     .toggleThemeMode();

                                      Scaffold.of(context).openEndDrawer();
                                    },
                                    icon: const Icon(Icons.menu,
                                        color: Colors.white));
                              })
                            ],
                          )
                        : Row(children: [
                            CircularButton(
                              onPressed: () {},
                              icon: const Icon(Icons.notifications_outlined,
                                  color: Colors.white),
                            ),
                            CircularButton(
                                onPressed: () {
                                  AdaptiveTheme.of(context).toggleThemeMode();
                                },
                                icon: const Icon(Icons.more_vert,
                                    color: Colors.white))
                          ]),
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
          child: RefreshIndicator(
            color: Colors.green,
            onRefresh: () async {
              followers = [];
              followings = [];
              posts = [];

              var lastUser = user;
              user = await UsersDBService().getUserById(user.id);
              if (lastUser == connectedUser) {
                AuthService().connectedUser = user;
                connectedUser = user;
              }

              await loadInitialPosts();
              setState(() {});
            },
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 500),
                        child: _buildInfo()),
                  ),
                  _buildButtonsBar(),
                  if (!user.isPrivate ||
                      (user.isPrivate && user.isFollowedByMe))
                    Column(
                      children: [
                        ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 600),
                            child: _buildHighliglts(context)),
                        _buildPostsGridView()
                      ],
                    ),
                ],
              ),
            ),
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

    return ResponsiveBuilder(builder: (context, sizingInformation) {
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
                TabBar(tabs: [
                  Tab(
                    icon: Icon(
                      Icons.table_rows_sharp,
                      color: isLightMode(context) ? Colors.blue : null,
                    ),
                  ),
                  Tab(
                    icon: Icon(
                      Icons.tag,
                      color: isLightMode(context) ? Colors.blue : null,
                    ),
                  )
                ]),
                SizedBox(
                  height: 350,
                  child: TabBarView(children: [
                    GridView.count(
                      controller: _postsScrollController,
                      crossAxisCount: sizingInformation.isMobile ? 3 : 4,
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
                                    Navigator.of(context)
                                        .push(MaterialPageRoute(
                                      builder: (context) => PostsPage(
                                        initialPostIndex: index,
                                        posts: posts,
                                        publisher: user,
                                      ),
                                    ));
                                  },
                                  child: Container(
                                    decoration: BoxDecoration(
                                        image: DecorationImage(
                                            fit: BoxFit.cover,
                                            image: CachedNetworkImageProvider(
                                                posts[index].photos.first,
                                                headers: {
                                                  "Authorization": AuthService()
                                                      .getAuthorizationHeader()
                                                }))),
                                  ),
                                )),
                    ),
                    GridView.count(
                      crossAxisCount: sizingInformation.isMobile ? 3 : 4,
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
    });
  }

  Widget _buildHighliglts(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Column(
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
                          height: 60,
                          width: 60,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: index > 0
                                ? isLightMode(context)
                                    ? Colors.grey[300]
                                    : Colors.grey[850]
                                : Theme.of(context).scaffoldBackgroundColor,
                            border: index > 0
                                ? null
                                : Border.all(
                                    width: 1.2,
                                    color: Theme.of(context).iconTheme.color!),
                          ),
                          child: index > 0
                              ? null
                              : const Center(
                                  child: Icon(
                                    Icons.add,
                                    size: 30,
                                  ),
                                ),
                        ),
                      )),
            ),
          ),
        ],
      ),
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

        // Makes followers list with controller loading

        showDialog(
          context: context,
          builder: (context) {
            return Dialog(
              child: ConstrainedBox(
                constraints:
                    const BoxConstraints(maxWidth: 400, maxHeight: 600),
                child: FutureBuilder<List<User>>(
                  future:
                      UsersDBService().getFollowers(user.id, followers.length),
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
                ),
              ),
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
        if (!AuthService().doesHasPermission(user)) {
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

        showDialog(
          context: context,
          builder: (context) {
            return Dialog(
              child: ConstrainedBox(
                constraints:
                    const BoxConstraints(maxWidth: 400, maxHeight: 600),
                child: FutureBuilder<List<User>>(
                  future: UsersDBService()
                      .getFollowings(user.id, followings.length),
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
                ),
              ),
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
