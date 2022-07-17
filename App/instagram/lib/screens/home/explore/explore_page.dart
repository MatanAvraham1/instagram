import 'dart:math';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/home/profile/profile_page.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:instagram/services/users_db_service.dart';
import 'package:material_floating_search_bar/material_floating_search_bar.dart';
import 'package:responsive_builder/responsive_builder.dart';

class ExplorePage extends StatefulWidget {
  const ExplorePage({Key? key}) : super(key: key);

  @override
  _ExplorePageState createState() => _ExplorePageState();
}

class _ExplorePageState extends State<ExplorePage>
    with AutomaticKeepAliveClientMixin {
  final FloatingSearchBarController floatingSearchBarController =
      FloatingSearchBarController();

  String usernameToSearch = "";

  @override
  void dispose() {
    floatingSearchBarController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);

    final isPortrait =
        MediaQuery.of(context).orientation == Orientation.portrait;

    return FloatingSearchBar(
      leadingActions: [
        FloatingSearchBarAction(
          builder: (context, animation) => CircularButton(
              icon: const Icon(Icons.search),
              onPressed: () {
                FloatingSearchAppBar.of(context)!.open();
              }),
        ),
        FloatingSearchBarAction.back(
          showIfClosed: false,
        ),
      ],
      actions: [
        FloatingSearchBarAction.searchToClear(
          showIfClosed: false,
        ),
      ],
      controller: floatingSearchBarController,
      body: ResponsiveBuilder(
        builder: (context, sizingInformation) => GridView.count(
          crossAxisCount: sizingInformation.isMobile ? 3 : 4,
          children: List.generate(
              30,
              (index) => Container(
                    color:
                        Colors.accents[Random().nextInt(Colors.accents.length)],
                  )),
        ),
      ),

      hint: 'Search...',
      scrollPadding: const EdgeInsets.only(top: 16, bottom: 56),
      transitionDuration: const Duration(milliseconds: 800),
      transitionCurve: Curves.easeInOut,
      physics: const BouncingScrollPhysics(),
      axisAlignment: isPortrait ? 0.0 : -1.0,
      openAxisAlignment: 0.0,
      width: isPortrait ? 600 : 500,
      debounceDelay: const Duration(milliseconds: 500),
      onQueryChanged: (query) {
        setState(() {
          usernameToSearch = query;
        });
      },
      // Specify a custom transition to be used for
      // animating between opened and closed stated.
      transition: CircularFloatingSearchBarTransition(),
      builder: (context, transition) {
        return ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Material(
            color: Colors.white,
            elevation: 4.0,
            child: Column(
                mainAxisSize: MainAxisSize.min,
                children: usernameToSearch.isEmpty
                    ? const [
                        ListTile(
                          title: Text(
                            "Enter username for results...",
                            style: TextStyle(color: Colors.black),
                          ),
                        )
                      ]
                    : [
                        FutureBuilder<User>(
                          future: UsersDBService.getUserByUsername(
                              usernameToSearch),
                          builder: (context, snapshot) {
                            if (snapshot.hasError) {
                              return const ListTile(
                                title: Text(
                                  "Not Found!",
                                  style: TextStyle(color: Colors.black),
                                ),
                              );
                            }

                            if (snapshot.connectionState ==
                                ConnectionState.waiting) {
                              return const CircularProgressIndicator();
                            }

                            return Column(
                                children: [snapshot.data!]
                                    .map((e) => ListTile(
                                          contentPadding:
                                              const EdgeInsets.all(8),
                                          onTap: () {
                                            Navigator.of(context)
                                                .push(MaterialPageRoute(
                                              builder: (context) =>
                                                  ProfilePage(user: e),
                                            ));
                                          },
                                          title: Text(
                                            e.username,
                                            style: const TextStyle(
                                                color: Colors.black),
                                          ),
                                          leading: CircleAvatar(
                                            backgroundImage:
                                                CachedNetworkImageProvider(
                                                    e.profilePhoto,
                                                    headers: {
                                                  "Authorization": AuthSerivce
                                                      .getAuthorizationHeader()
                                                }),
                                          ),
                                        ))
                                    .toList());
                          },
                        ),
                      ]),
          ),
        );
      },
    );
  }

  @override
  bool get wantKeepAlive => true;
}
