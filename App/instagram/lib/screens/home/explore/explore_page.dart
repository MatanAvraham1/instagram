import 'dart:math';
import 'package:flutter/material.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/home/profile/profile_page.dart';
import 'package:instagram/services/online_db_service.dart';
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
                          future: OnlineDBService.getUserByUsername(
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
                                            backgroundImage: NetworkImage(e
                                                    .photoUrl.isNotEmpty
                                                ? e.photoUrl
                                                : "https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg"),
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