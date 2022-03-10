import 'dart:convert';

import 'package:instagram/models/user.dart';

class Comment {
  User publisher;
  String comment;
  String id;
  String postId;
  DateTime publishedAt;
  int likes;
  bool isLikedByMe;

  Comment({
    required this.publisher,
    required this.comment,
    required this.id,
    required this.postId,
    required this.publishedAt,
    required this.likes,
    required this.isLikedByMe,
  });

  Comment copyWith({
    User? publisher,
    String? comment,
    String? id,
    String? postId,
    DateTime? publishedAt,
    int? likes,
    bool? isLikedByMe,
  }) {
    return Comment(
      publisher: publisher ?? this.publisher,
      comment: comment ?? this.comment,
      id: id ?? this.id,
      postId: postId ?? this.postId,
      publishedAt: publishedAt ?? this.publishedAt,
      likes: likes ?? this.likes,
      isLikedByMe: isLikedByMe ?? this.isLikedByMe,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'publisher': publisher.toMap(),
      'comment': comment,
      'id': id,
      'postId': postId,
      'publishedAt': publishedAt.millisecondsSinceEpoch,
      'likes': likes,
      'isLikedByMe': isLikedByMe,
    };
  }

  factory Comment.fromMap(Map<String, dynamic> map) {
    return Comment(
      publisher: User.fromMap(map['publisher']),
      comment: map['comment'] ?? '',
      id: map['id'] ?? '',
      postId: map['postId'] ?? '',
      publishedAt: DateTime.parse(map['publishedAt']),
      likes: map['likes']?.toInt() ?? 0,
      isLikedByMe: map['isLikedByMe'] ?? false,
    );
  }

  String toJson() => json.encode(toMap());

  factory Comment.fromJson(String source) =>
      Comment.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Comment(publisher: $publisher, comment: $comment, id: $id, postId: $postId, publishedAt: $publishedAt, likes: $likes, isLikedByMe: $isLikedByMe)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Comment &&
        other.publisher == publisher &&
        other.comment == comment &&
        other.id == id &&
        other.postId == postId &&
        other.publishedAt == publishedAt &&
        other.likes == likes &&
        other.isLikedByMe == isLikedByMe;
  }

  @override
  int get hashCode {
    return publisher.hashCode ^
        comment.hashCode ^
        id.hashCode ^
        postId.hashCode ^
        publishedAt.hashCode ^
        likes.hashCode ^
        isLikedByMe.hashCode;
  }
}
