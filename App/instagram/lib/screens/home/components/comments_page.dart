import 'package:flutter/material.dart';

import 'package:instagram/models/comment_model.dart';
import 'package:instagram/models/post_model.dart';
import 'package:instagram/models/user_model.dart';
import 'package:instagram/screens/home/components/comment_tile.dart';
import 'package:instagram/screens/home/components/loading_indicator.dart';
import 'package:instagram/services/comments_db_service.dart';

class CommentsPage extends StatefulWidget {
  final Post post;
  final User postPublisher;

  const CommentsPage({
    Key? key,
    required this.post,
    required this.postPublisher,
  }) : super(key: key);

  @override
  State<CommentsPage> createState() => _CommentsPageState();
}

class _CommentsPageState extends State<CommentsPage> {
  final ScrollController _scrollController = ScrollController();

  List<Map<User, Comment>> comments = [];

  bool _isLoadingMoreComments = false;
  bool _isLoadingComments = false;

  void loadComments() {
    // Load Comments
    setState(() {
      _isLoadingComments = true;
    });

    CommentsDBService()
        .getCommentsByPostId(widget.post.id, comments.length)
        .then((value) {
      setState(() {
        comments.addAll(value);

        _isLoadingComments = false;
      });
    });
  }

  void loadMoreComments() {
    if (_isLoadingMoreComments) {
      return;
    }

    if (_scrollController.position.extentAfter < 500) {
      setState(() {
        _isLoadingMoreComments = true;
      });
      CommentsDBService()
          .getCommentsByPostId(widget.post.id, comments.length)
          .then((value) {
        setState(() {
          comments.addAll(value);

          _isLoadingMoreComments = false;
        });
      });
    }
  }

  @override
  void initState() {
    loadComments();
    _scrollController.addListener(loadMoreComments);

    super.initState();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("Comments"),
        ),
        body: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 700),
          child: _isLoadingComments
              ? const Padding(
                  padding: EdgeInsets.only(top: 70),
                  child: LoadingIndicator(
                    radius: 20,
                    title: "Loading Comments",
                    strokeWidth: 2,
                  ),
                )
              : ListView.builder(
                  controller: _scrollController,
                  itemCount: comments.length + 2,
                  itemBuilder: (context, index) => index == comments.length + 1
                      ? _isLoadingMoreComments
                          ? const LoadingIndicator(
                              radius: 25,
                              title: "Loading Comments",
                              strokeWidth: 2,
                            )
                          : Container()
                      : index == 0
                          ? CommentTile(
                              commentPublisher: widget.postPublisher,
                              comment: Comment(
                                  replies: 0,
                                  publisherId: widget.postPublisher.id,
                                  isLikedByMe: false,
                                  comment: widget.post.publisherComment,
                                  id: widget.post.id,
                                  postId: widget.post.id,
                                  createdAt: widget.post.createdAt,
                                  likes: widget.post.likes),
                              isOwnerComment: true,
                            )
                          : CommentTile(
                              commentPublisher: comments[index - 1].keys.first,
                              comment: comments[index - 1].values.first,
                              isOwnerComment: false,
                            )),
        ));
  }
}
