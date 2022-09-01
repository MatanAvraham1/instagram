import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:instagram/classes/number_helper.dart';
import 'package:instagram/models/comment_model.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/home/components/story_tile.dart';
import 'package:instagram/screens/home/profile/profile_page.dart';
import 'package:instagram/services/comments_db_service.dart';
import 'package:like_button/like_button.dart';

class CommentTile extends StatelessWidget {
  const CommentTile({
    Key? key,
    required this.comment,
    required this.commentPublisher,
    required this.isOwnerComment,
  }) : super(key: key);

  final User commentPublisher;
  final Comment comment;
  final bool isOwnerComment;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          leading: SizedBox(
              height: 45,
              width: 45,
              child: FittedBox(
                  child: StoryTile(
                owner: commentPublisher,
                playSingleStory: true,
              ))),
          title: RichText(
            text: TextSpan(
              children: <TextSpan>[
                TextSpan(
                    recognizer: TapGestureRecognizer()
                      ..onTap = () {
                        Navigator.of(context).push(MaterialPageRoute(
                          builder: (context) =>
                              ProfilePage(user: commentPublisher),
                        ));
                      },
                    text: '${commentPublisher.username} ',
                    style:  TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).iconTheme.color)),
                TextSpan(text: comment.comment, style: TextStyle(color: Theme.of(context).iconTheme.color)),
              ],
            ),
          ),
          subtitle: Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text(
                "${DateTime.now().difference(comment.createdAt).inDays}d  Reply"),
          ),
          trailing: isOwnerComment
              ? null
              : SizedBox(
                  width: 40,
                  child: LikeButton(
                    isLiked: comment.isLikedByMe,
                    onTap: (isLiked) async {
                      if (isLiked) {
                        await CommentsDBService().unlikeComment(comment.id);
                      } else {
                        await CommentsDBService().likeComment(comment.id);
                      }

                      comment.isLikedByMe = !comment.isLikedByMe;
                      return !isLiked;
                    },
                    size: 15,
                    likeCount: comment.likes,
                    likeCountAnimationType: LikeCountAnimationType.all,
                    countPostion: CountPostion.bottom,
                    countBuilder: (likeCount, isLiked, text) => Text(
                        NumberHelper.getShortNumber(likeCount!),
                        style:
                            const TextStyle(color: Colors.grey, fontSize: 12)),
                  )),
        ),
        if (isOwnerComment)
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20.0),
            child: Divider(
              height: 20,
              color: Colors.white,
            ),
          ),
        const SizedBox(
          height: 10,
        ),
      ],
    );
  }
}
