import 'package:flutter/material.dart';

import 'package:instagram/models/comment_model.dart';
import 'package:instagram/models/post_model.dart';
import 'package:instagram/screens/home/components/comment_tile.dart';
import 'package:instagram/screens/home/components/loading_indicator.dart';
import 'package:instagram/services/online_db_service.dart';

class CommentsPage extends StatefulWidget {
  final Post post;

  const CommentsPage({
    Key? key,
    required this.post,
  }) : super(key: key);

  @override
  State<CommentsPage> createState() => _CommentsPageState();
}

class _CommentsPageState extends State<CommentsPage> {
  final ScrollController _scrollController = ScrollController();

  List<Comment> comments = [];

  bool _isLoadingMoreComments = false;
  bool _isLoadingComments = false;

  void loadComments() {
    // Load Comments
    setState(() {
      _isLoadingComments = true;
    });

    OnlineDBService.getComments(
            widget.post.publisher!.id, widget.post.id, comments.length)
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
      OnlineDBService.getComments(
              widget.post.publisher!.id, widget.post.id, comments.length)
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
        body: _isLoadingComments
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
                            postPublisherId: widget.post.publisher!.id,
                            comment: Comment(
                                publisher: widget.post.publisher!,
                                isLikedByMe: false,
                                comment: widget.post.publisherComment,
                                id: widget.post.id,
                                postId: widget.post.id,
                                publishedAt: widget.post.publishedAt,
                                likes: widget.post.likes),
                            isOwnerComment: true,
                          )
                        : CommentTile(
                            postPublisherId: widget.post.publisher!.id,
                            comment: comments[index - 1],
                            isOwnerComment: false,
                          )));
  }
}
