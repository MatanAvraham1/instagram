import 'dart:convert';

import 'package:flutter/foundation.dart';

class Post {
  String ownerId;
  String postId;
  List<String> photosUrls;
  List<String> taggedUsers;
  DateTime publishedAt;
  int likes;
  int comments;
  Post({
    required this.ownerId,
    required this.postId,
    required this.photosUrls,
    required this.taggedUsers,
    required this.publishedAt,
    required this.likes,
    required this.comments,
  });

  Post copyWith({
    String? ownerId,
    String? postId,
    List<String>? photosUrls,
    List<String>? taggedUsers,
    DateTime? publishedAt,
    int? likes,
    int? comments,
  }) {
    return Post(
      ownerId: ownerId ?? this.ownerId,
      postId: postId ?? this.postId,
      photosUrls: photosUrls ?? this.photosUrls,
      taggedUsers: taggedUsers ?? this.taggedUsers,
      publishedAt: publishedAt ?? this.publishedAt,
      likes: likes ?? this.likes,
      comments: comments ?? this.comments,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'ownerId': ownerId,
      'postId': postId,
      'photosUrls': photosUrls,
      'taggedUsers': taggedUsers,
      'publishedAt': publishedAt.millisecondsSinceEpoch,
      'likes': likes,
      'comments': comments,
    };
  }

  factory Post.fromMap(Map<String, dynamic> map) {
    return Post(
      ownerId: map['ownerId'] ?? '',
      postId: map['postId'] ?? '',
      photosUrls: List<String>.from(map['photosUrls']),
      taggedUsers: List<String>.from(map['taggedUsers']),
      publishedAt: DateTime.fromMillisecondsSinceEpoch(map['publishedAt']),
      likes: map['likes']?.toInt() ?? 0,
      comments: map['comments']?.toInt() ?? 0,
    );
  }

  String toJson() => json.encode(toMap());

  factory Post.fromJson(String source) => Post.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Post(ownerId: $ownerId, postId: $postId, photosUrls: $photosUrls, taggedUsers: $taggedUsers, publishedAt: $publishedAt, likes: $likes, comments: $comments)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Post &&
        other.ownerId == ownerId &&
        other.postId == postId &&
        listEquals(other.photosUrls, photosUrls) &&
        listEquals(other.taggedUsers, taggedUsers) &&
        other.publishedAt == publishedAt &&
        other.likes == likes &&
        other.comments == comments;
  }

  @override
  int get hashCode {
    return ownerId.hashCode ^
        postId.hashCode ^
        photosUrls.hashCode ^
        taggedUsers.hashCode ^
        publishedAt.hashCode ^
        likes.hashCode ^
        comments.hashCode;
  }
}
