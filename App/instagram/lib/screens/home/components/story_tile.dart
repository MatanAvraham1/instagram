import 'package:animations/animations.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/home/components/story_page.dart';
import 'package:instagram/services/auth_service.dart';

class StoryTile extends StatefulWidget {
  final User owner;
  final bool playSingleStory;
  final bool visibleTitle;

  const StoryTile({
    Key? key,
    required this.owner,
    this.playSingleStory = false,
    this.visibleTitle = false,
  }) : super(key: key);

  @override
  State<StoryTile> createState() => _StoryTileState();
}

class _StoryTileState extends State<StoryTile> {
  @override
  Widget build(BuildContext context) {
    var storyCircleAvatar = Container(
      padding: const EdgeInsets.all(2),
      height: 70,
      width: 70,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: (!widget.owner.isFollowedByMe && widget.owner.isPrivate) ||
                widget.owner.stories == 0
            ? null
            : const LinearGradient(
                colors: [Colors.red, Colors.yellow],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
      ),
      child: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: CachedNetworkImageProvider(widget.owner.profilePhoto,
                headers: {
                  "Authorization": AuthSerivce.getAuthorizationHeader()
                }),
            fit: BoxFit.cover,
          ),
          shape: BoxShape.circle,
          border: Border.all(
              color: Theme.of(context).scaffoldBackgroundColor, width: 2),
        ),
      ),
    );

    return OpenContainer(
      tappable: AuthSerivce.doesHasPermission(widget.owner) &&
          widget.owner.lastDayStories! > 0,
      closedElevation: 0,
      openElevation: 0,
      closedColor: Colors.transparent,
      openBuilder: (context, action) => StoryPage(
        usersToPlay: [widget.owner],
        initialUser: widget.owner,
      ),
      closedBuilder: (context, action) => Padding(
        padding: const EdgeInsets.only(left: 10),
        child: !widget.visibleTitle
            ? storyCircleAvatar
            : Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  storyCircleAvatar,
                  if (widget.visibleTitle)
                    Container(
                      padding: const EdgeInsets.only(top: 4),
                      width: 70,
                      child: Text(
                        widget.owner.username,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 12),
                      ),
                    ),
                ],
              ),
      ),
    );
  }
}
