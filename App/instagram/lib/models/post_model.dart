import 'dart:convert';

import 'package:collection/collection.dart';

import 'package:instagram/models/user_model.dart';

class Post {
  User? publisher;
  String id;

  String publisherComment;
  List<String> photosUrls;
  List<String> taggedUsers;
  String location;
  DateTime publishedAt;

  int likes;
  int comments;

  bool isLikedByMe;

  Post({
    required this.publisher,
    required this.id,
    required this.publisherComment,
    required this.photosUrls,
    required this.taggedUsers,
    required this.location,
    required this.publishedAt,
    required this.likes,
    required this.comments,
    required this.isLikedByMe,
  });

  Post copyWith({
    User? publisher,
    String? id,
    String? publisherComment,
    List<String>? photosUrls,
    List<String>? taggedUsers,
    String? location,
    DateTime? publishedAt,
    int? likes,
    int? comments,
    bool? isLikedByMe,
  }) {
    return Post(
      publisher: publisher ?? this.publisher,
      id: id ?? this.id,
      publisherComment: publisherComment ?? this.publisherComment,
      photosUrls: photosUrls ?? this.photosUrls,
      taggedUsers: taggedUsers ?? this.taggedUsers,
      location: location ?? this.location,
      publishedAt: publishedAt ?? this.publishedAt,
      likes: likes ?? this.likes,
      comments: comments ?? this.comments,
      isLikedByMe: isLikedByMe ?? this.isLikedByMe,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'publisher': publisher?.toMap(),
      'id': id,
      'publisherComment': publisherComment,
      'photosUrls': photosUrls,
      'taggedUsers': taggedUsers,
      'location': location,
      'publishedAt': publishedAt.millisecondsSinceEpoch,
      'likes': likes,
      'comments': comments,
      'isLikedByMe': isLikedByMe,
    };
  }

  factory Post.fromMap(Map<String, dynamic> map) {
    return Post(
      publisher: map['post']['publisher'] != null
          ? User.fromMap(map['post']['publisher'])
          : null,
      id: map['post']['id'] ?? '',
      publisherComment: map['post']['publisherComment'] ?? '',
      photosUrls: List<String>.from(map['post']['photosUrls']),
      taggedUsers: List<String>.from(map['post']['taggedUsers']),
      location: map['post']['location'] ?? '',
      publishedAt: DateTime.parse(map['post']['publishedAt']),
      likes: map['post']['likes']?.toInt() ?? 0,
      comments: map['post']['comments']?.toInt() ?? 0,
      isLikedByMe: map['isLikedByMe'] ?? false,
    );
  }

  String toJson() => json.encode(toMap());

  factory Post.fromJson(String source) => Post.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Post(publisher: $publisher, id: $id, publisherComment: $publisherComment, photosUrls: $photosUrls, taggedUsers: $taggedUsers, location: $location, publishedAt: $publishedAt, likes: $likes, comments: $comments, isLikedByMe: $isLikedByMe)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    final listEquals = const DeepCollectionEquality().equals;

    return other is Post &&
        other.publisher == publisher &&
        other.id == id &&
        other.publisherComment == publisherComment &&
        listEquals(other.photosUrls, photosUrls) &&
        listEquals(other.taggedUsers, taggedUsers) &&
        other.location == location &&
        other.publishedAt == publishedAt &&
        other.likes == likes &&
        other.comments == comments &&
        other.isLikedByMe == isLikedByMe;
  }

  @override
  int get hashCode {
    return publisher.hashCode ^
        id.hashCode ^
        publisherComment.hashCode ^
        photosUrls.hashCode ^
        taggedUsers.hashCode ^
        location.hashCode ^
        publishedAt.hashCode ^
        likes.hashCode ^
        comments.hashCode ^
        isLikedByMe.hashCode;
  }
}
