import 'package:dismissible_page/dismissible_page.dart';
import 'package:flutter/material.dart';
import 'package:story/story.dart';

import 'package:instagram/models/story_model.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/home/components/loading_indicator.dart';
import 'package:instagram/screens/home/profile/profile_page.dart';
import 'package:instagram/services/online_db_service.dart';

class StoryPage extends StatefulWidget {
  final List<User> usersToPlay;
  final User initialUser;

  const StoryPage({
    Key? key,
    required this.usersToPlay,
    required this.initialUser,
  }) : super(key: key);

  @override
  _StoryPageState createState() => _StoryPageState();
}

class _StoryPageState extends State<StoryPage> {
  late User currentUser;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return DismissiblePage(
      onDismiss: () => Navigator.of(context).pop(),
      child: StoryPageView(
        initialPage: widget.usersToPlay.indexOf(widget.initialUser),
        pageLength: widget.usersToPlay.length,
        storyLength: (int pageIndex) {
          return widget.usersToPlay.elementAt(pageIndex).stories;
        },
        onPageLimitReached: () {
          Navigator.pop(context);
        },
        itemBuilder: (context, pageIndex, storyIndex) {
          currentUser = widget.usersToPlay[pageIndex];

          return FutureBuilder<List<Story>>(
            future: OnlineDBService.getLast24HoursStories(currentUser.id),
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                return Text("Error! ${snapshot.error}");
              }

              if (snapshot.connectionState == ConnectionState.waiting) {
                return const LoadingIndicator(
                  title: "Loading Story",
                  radius: 20,
                  strokeWidth: 4,
                );
              }

              return Stack(
                children: [
                  Positioned.fill(
                    child: Container(color: Colors.black),
                  ),
                  Positioned.fill(
                    child: Image.network(
                      snapshot.data![storyIndex].photoUrl,
                      fit: BoxFit.cover,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 44, left: 8),
                    child: Row(
                      children: [
                        Container(
                          height: 32,
                          width: 32,
                          decoration: BoxDecoration(
                            image: DecorationImage(
                              image: NetworkImage(currentUser.photoUrl),
                              fit: BoxFit.cover,
                            ),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(
                          width: 8,
                        ),
                        Text(
                          currentUser.username,
                          style: const TextStyle(
                            fontSize: 17,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            },
          );
        },
        gestureItemBuilder: (context, pageIndex, storyIndex) {
          return Stack(
            children: [
              Align(
                alignment: Alignment.topRight,
                child: Padding(
                  padding: const EdgeInsets.only(top: 32),
                  child: IconButton(
                    padding: EdgeInsets.zero,
                    color: Colors.white,
                    icon: const Icon(Icons.close),
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                ),
              ),
              Align(
                alignment: Alignment.topLeft,
                child: Padding(
                  padding: const EdgeInsets.only(top: 32),
                  child: IconButton(
                    padding: EdgeInsets.zero,
                    color: Colors.transparent,
                    icon: const Icon(Icons.close),
                    onPressed: () {
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) => ProfilePage(
                          user: widget.usersToPlay[pageIndex],
                        ),
                      ));
                    },
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
