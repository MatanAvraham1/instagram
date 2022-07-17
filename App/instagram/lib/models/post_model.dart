import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:instagram/services/ServerIP.dart';

class Post {
  String id;

  String publisherId;
  String location;
  String publisherComment;
  List<String> taggedUsers;
  List<String> photos;

  int likes;
  int comments;

  bool isLikedByMe;
  DateTime createdAt;

  Post({
    required this.id,
    required this.publisherId,
    required this.location,
    required this.publisherComment,
    required this.taggedUsers,
    required this.photos,
    required this.likes,
    required this.comments,
    required this.isLikedByMe,
    required this.createdAt,
  });

  Post copyWith({
    String? id,
    String? publisherId,
    String? location,
    String? publisherComment,
    List<String>? taggedUsers,
    List<String>? photos,
    int? likes,
    int? comments,
    bool? isLikedByMe,
    DateTime? createdAt,
  }) {
    return Post(
      id: id ?? this.id,
      publisherId: publisherId ?? this.publisherId,
      location: location ?? this.location,
      publisherComment: publisherComment ?? this.publisherComment,
      taggedUsers: taggedUsers ?? this.taggedUsers,
      photos: photos ?? this.photos,
      likes: likes ?? this.likes,
      comments: comments ?? this.comments,
      isLikedByMe: isLikedByMe ?? this.isLikedByMe,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'publisherId': publisherId,
      'location': location,
      'publisherComment': publisherComment,
      'taggedUsers': taggedUsers,
      'photos': photos,
      'likes': likes,
      'comments': comments,
      'isLikedByMe': isLikedByMe,
      'createdAt': createdAt.millisecondsSinceEpoch,
    };
  }

  factory Post.fromMap(Map<String, dynamic> map) {
    List<String> photosUrls = [];
    var photosNames = List<String>.from(map['photos']);
    for (var photoName in photosNames) {
      photosUrls.add(SERVER_API_URL + "posts/${map['id']}/$photoName");
    }

    return Post(
      id: map['id'] ?? '',
      publisherId: map['publisherId'] ?? '',
      location: map['location'] ?? '',
      publisherComment: map['publisherComment'] ?? '',
      taggedUsers: List<String>.from(map['taggedUsers']),
      photos: photosUrls,
      likes: map['likes']?.toInt() ?? 0,
      comments: map['comments']?.toInt() ?? 0,
      isLikedByMe: map['isLikedByMe'] ?? false,
      createdAt: DateTime.parse(map['createdAt']),
    );
  }

  String toJson() => json.encode(toMap());

  factory Post.fromJson(String source) => Post.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Post(id: $id, publisherId: $publisherId, location: $location, publisherComment: $publisherComment, taggedUsers: $taggedUsers, photos: $photos, likes: $likes, comments: $comments, isLikedByMe: $isLikedByMe, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Post &&
        other.id == id &&
        other.publisherId == publisherId &&
        other.location == location &&
        other.publisherComment == publisherComment &&
        listEquals(other.taggedUsers, taggedUsers) &&
        listEquals(other.photos, photos) &&
        other.likes == likes &&
        other.comments == comments &&
        other.isLikedByMe == isLikedByMe &&
        other.createdAt == createdAt;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        publisherId.hashCode ^
        location.hashCode ^
        publisherComment.hashCode ^
        taggedUsers.hashCode ^
        photos.hashCode ^
        likes.hashCode ^
        comments.hashCode ^
        isLikedByMe.hashCode ^
        createdAt.hashCode;
  }
}
