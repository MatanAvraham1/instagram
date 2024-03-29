import 'dart:math';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:instagram/classes/number_helper.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/home/components/story_tile.dart';
import 'package:instagram/screens/home/profile/profile_page.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:instagram/services/posts_db_service.dart';
import 'package:like_button/like_button.dart';

import 'package:instagram/models/post_model.dart';
import 'package:instagram/screens/home/components/comments_page.dart';
import 'package:material_floating_search_bar/material_floating_search_bar.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class PostTile extends StatefulWidget {
  final Post post;
  final User publisher;
  const PostTile({
    Key? key,
    required this.post,
    required this.publisher,
  }) : super(key: key);

  @override
  State<PostTile> createState() => _PostTileState();
}

class MyCustomScrollBehavior extends MaterialScrollBehavior {
  // Override behavior methods and getters like dragDevices
  @override
  Set<PointerDeviceKind> get dragDevices => {
        PointerDeviceKind.touch,
        PointerDeviceKind.mouse,
        // etc.
      };
}

class _PostTileState extends State<PostTile> {
  // final controller = PageController(viewportFraction: 0.8, keepPage: true);
  final controller = PageController(initialPage: 0);

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 5),
      child: Column(
        children: [
          _buildTop(),
          _buildImage(),
          Padding(
            padding: const EdgeInsets.only(left: 12, right: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildButtonsBar(),
                _buildLikedRow(),
                if (widget.post.publisherComment.isNotEmpty)
                  _buildOwnerComment(),
                if (widget.post.comments > 0) _buildPreviewComments(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  InkWell _buildTop() {
    return InkWell(
      onTap: () {
        Navigator.of(context).push(MaterialPageRoute(
          builder: (context) => ProfilePage(user: widget.publisher),
        ));
      },
      child: Container(
        height: 50,
        color: Theme.of(context).scaffoldBackgroundColor,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                const SizedBox(
                  width: 4,
                ),
                SizedBox(
                  height: 38,
                  width: 38,
                  child: FittedBox(
                    child: StoryTile(
                      owner: widget.publisher,
                      playSingleStory: true,
                    ),
                  ),
                ),
                const SizedBox(
                  width: 7,
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.publisher.fullname,
                      style: const TextStyle(fontSize: 14),
                    ),
                    Text(
                      widget.post.location,
                      style: const TextStyle(fontSize: 12),
                    ),
                  ],
                )
              ],
            ),
            CircularButton(
                onPressed: () {
                  showModalBottomSheet(
                    context: context,
                    builder: (context) => Container(),
                  );
                },
                icon: const Icon(Icons.more_vert)),
          ],
        ),
      ),
    );
  }

  Widget _buildImage() {
    return SizedBox(
      height: 495,
      child: Column(
        children: [
          GestureDetector(
            // TODO: fix that
            onDoubleTap: () async {
              setState(() {
                widget.post.isLikedByMe = true;
              });
              if (!widget.post.isLikedByMe) {
                await PostsDBService().likePost(widget.post.id);
              }
            },
            child: SizedBox(
              height: 460,
              child: PageView.builder(
                  scrollBehavior: MyCustomScrollBehavior(),
                  scrollDirection: Axis.horizontal,
                  controller: controller,
                  itemCount: widget.post.photos.length,
                  itemBuilder: (context, index) => Container(
                        height: 460,
                        decoration: BoxDecoration(
                          image: DecorationImage(
                              image: CachedNetworkImageProvider(
                                  widget.post.photos[index],
                                  headers: {
                                    "Authorization":
                                        AuthService().getAuthorizationHeader()
                                  }),
                              fit: BoxFit.fitHeight),
                        ),
                      )),
            ),
          ),
          const SizedBox(
            height: 12,
          ),
          SmoothPageIndicator(
            onDotClicked: (index) {
              controller.animateToPage(index,
                  duration: Duration(milliseconds: 600), curve: Curves.ease);
            },
            controller: controller,
            count: widget.post.photos.length,
            effect: CustomizableEffect(
              activeDotDecoration: const DotDecoration(
                  width: 12,
                  height: 12,
                  color: Colors.indigo,
                  rotationAngle: 400,
                  dotBorder: DotBorder(
                    padding: 2,
                    width: 2,
                    color: Colors.indigo,
                  ),
                  borderRadius: BorderRadius.all(Radius.circular(1.3))),
              dotDecoration: DotDecoration(
                width: 12,
                height: 12,
                color: Colors.grey,
                borderRadius: BorderRadius.circular(24),
                // verticalOffset: 0,
              ),
              spacing: 8.0,
            ),
          ),
        ],
      ),
    );
  }

  Container _buildButtonsBar() {
    return Container(
      height: 50,
      color: Theme.of(context).scaffoldBackgroundColor,
      child: Row(
        children: [
          LikeButton(
            isLiked: widget.post.isLikedByMe,
            size: 28,
            onTap: (isLiked) async {
              if (isLiked) {
                await PostsDBService().unlikePost(widget.post.id);
              } else {
                await PostsDBService().likePost(widget.post.id);
              }
              widget.post.isLikedByMe = !widget.post.isLikedByMe;
              return !isLiked;
            },
          ),
          GestureDetector(
            onTap: () {
              Navigator.of(context).push(MaterialPageRoute(
                builder: (context) => CommentsPage(
                  postPublisher: widget.publisher,
                  post: widget.post,
                ),
              ));
            },
            child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 14.0, vertical: 14),
                child: Icon(Icons.comment)),
            // child: Icon(MyFlutterApp.comment_empty)),
          ),
          GestureDetector(
            onTap: () {
              showModalBottomSheet(
                context: context,
                builder: (context) => Container(),
              );
            },
            child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 12.0),
                child: Icon(Icons.send)),
            // child: Icon(MyFlutterApp.direct_outlined)),
          )
        ],
      ),
    );
  }

  Row _buildLikedRow() {
    return Row(
      children: [
        CircleAvatar(
          radius: 9,
          backgroundColor:
              Colors.accents[Random().nextInt(Colors.accents.length)],
        ),
        const SizedBox(
          width: 3,
        ),
        RichText(
          maxLines: 4,
          text: TextSpan(
            children: <TextSpan>[
              TextSpan(
                  text: 'Liked by ',
                  style: TextStyle(color: Theme.of(context).iconTheme.color)),
              TextSpan(
                  text: "mencchem_berger ",
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).iconTheme.color)),
              TextSpan(
                  text: "and ",
                  style: TextStyle(color: Theme.of(context).iconTheme.color)),
              TextSpan(
                  text:
                      "${NumberHelper.getShortNumber(widget.post.likes - 1)} others",
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).iconTheme.color))
            ],
          ),
        ),
      ],
    );
  }

  Column _buildOwnerComment() {
    return Column(
      children: [
        const SizedBox(
          height: 3,
        ),
        _buildPreviewComment(widget.publisher, widget.post.publisherComment,
            isOwnerComment: true)
      ],
    );
  }

  Widget _buildPreviewComments() {
    // int howMuchCommentsToShow = nextInt(
    //     0, widget.post.comments.length <= 3 ? widget.post.comments.length : 3);

    // if (howMuchCommentsToShow == 0) {
    //   return Container();
    // }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(
          height: 2,
        ),
        GestureDetector(
          onTap: () {
            Navigator.of(context).push(MaterialPageRoute(
              builder: (context) => CommentsPage(
                postPublisher: widget.publisher,
                post: widget.post,
              ),
            ));
          },
          child: Text(
            "View all ${widget.post.comments} comments",
            style: const TextStyle(color: Colors.grey),
          ),
        ),
        const SizedBox(
          height: 1,
        ),
        // Column(
        //   children: List.generate(
        //     howMuchCommentsToShow,
        //     (index) {
        //       final commentOwner = OfflineDBService.getUserByUid(
        //           widget.post.comments[index].ownerUid);

        //       return _buildPreviewComment(
        //           commentOwner, widget.post.comments[index].comment);
        //     },
        //   ),
        // ),
      ],
    );
  }

  Padding _buildPreviewComment(User owner, String comment,
      {bool isOwnerComment = false}) {
    return Padding(
      padding: const EdgeInsets.only(top: 1, bottom: 1),
      child: RichText(
        maxLines: isOwnerComment ? 4 : 2,
        text: TextSpan(
          children: <TextSpan>[
            TextSpan(
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    Navigator.of(context).push(MaterialPageRoute(
                      builder: (context) => ProfilePage(user: widget.publisher),
                    ));
                  },
                text: '${widget.publisher.username} ',
                style: const TextStyle(fontWeight: FontWeight.bold)),
            TextSpan(text: comment),
          ],
        ),
      ),
    );
  }
}
