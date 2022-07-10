import 'dart:convert';

class Comment {
  String id;

  String publisherId;
  String postId;
  String comment;
  String replyToComment;

  DateTime createdAt;

  bool isLikedByMe;

  int likes;
  int replies;

  Comment({
    required this.id,
    required this.publisherId,
    required this.postId,
    required this.comment,
    required this.replyToComment,
    required this.createdAt,
    required this.isLikedByMe,
    required this.likes,
    required this.replies,
  });

  Comment copyWith({
    String? id,
    String? publisherId,
    String? postId,
    String? comment,
    String? replyToComment,
    DateTime? createdAt,
    bool? isLikedByMe,
    int? likes,
    int? replies,
  }) {
    return Comment(
      id: id ?? this.id,
      publisherId: publisherId ?? this.publisherId,
      postId: postId ?? this.postId,
      comment: comment ?? this.comment,
      replyToComment: replyToComment ?? this.replyToComment,
      createdAt: createdAt ?? this.createdAt,
      isLikedByMe: isLikedByMe ?? this.isLikedByMe,
      likes: likes ?? this.likes,
      replies: replies ?? this.replies,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'publisherId': publisherId,
      'postId': postId,
      'comment': comment,
      'replyToComment': replyToComment,
      'createdAt': createdAt.millisecondsSinceEpoch,
      'isLikedByMe': isLikedByMe,
      'likes': likes,
      'replies': replies,
    };
  }

  factory Comment.fromMap(Map<String, dynamic> map) {
    return Comment(
      id: map['id'] ?? '',
      publisherId: map['publisherId'] ?? '',
      postId: map['postId'] ?? '',
      comment: map['comment'] ?? '',
      replyToComment: map['replyToComment'] ?? '',
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['createdAt']),
      isLikedByMe: map['isLikedByMe'] ?? false,
      likes: map['likes']?.toInt() ?? 0,
      replies: map['replies']?.toInt() ?? 0,
    );
  }

  String toJson() => json.encode(toMap());

  factory Comment.fromJson(String source) =>
      Comment.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Comment(id: $id, publisherId: $publisherId, postId: $postId, comment: $comment, replyToComment: $replyToComment, createdAt: $createdAt, isLikedByMe: $isLikedByMe, likes: $likes, replies: $replies)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Comment &&
        other.id == id &&
        other.publisherId == publisherId &&
        other.postId == postId &&
        other.comment == comment &&
        other.replyToComment == replyToComment &&
        other.createdAt == createdAt &&
        other.isLikedByMe == isLikedByMe &&
        other.likes == likes &&
        other.replies == replies;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        publisherId.hashCode ^
        postId.hashCode ^
        comment.hashCode ^
        replyToComment.hashCode ^
        createdAt.hashCode ^
        isLikedByMe.hashCode ^
        likes.hashCode ^
        replies.hashCode;
  }
}
