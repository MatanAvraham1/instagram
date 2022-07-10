import 'dart:convert';

import 'package:instagram/models/story_structure_model.dart';

class Story {
  late StoryStructure structure; // TODO: fix that
  String publisherId;
  String id;
  DateTime createdAt;

  int? likes;
  int? viewers;

  bool isLikedByMe;

  Story({
    required this.publisherId,
    required this.id,
    required this.createdAt,
    this.likes,
    this.viewers,
    required this.isLikedByMe,
  });

  Story copyWith({
    String? publisherId,
    String? id,
    DateTime? createdAt,
    int? likes,
    int? viewers,
    bool? isLikedByMe,
  }) {
    return Story(
      publisherId: publisherId ?? this.publisherId,
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      likes: likes ?? this.likes,
      viewers: viewers ?? this.viewers,
      isLikedByMe: isLikedByMe ?? this.isLikedByMe,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'publisherId': publisherId,
      'id': id,
      'createdAt': createdAt.millisecondsSinceEpoch,
      'likes': likes,
      'viewers': viewers,
      'isLikedByMe': isLikedByMe,
    };
  }

  factory Story.fromMap(Map<String, dynamic> map) {
    return Story(
      publisherId: map['publisherId'] ?? '',
      id: map['id'] ?? '',
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['createdAt']),
      likes: map['likes']?.toInt(),
      viewers: map['viewers']?.toInt(),
      isLikedByMe: map['isLikedByMe'] ?? false,
    );
  }

  String toJson() => json.encode(toMap());

  factory Story.fromJson(String source) => Story.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Story(publisherId: $publisherId, id: $id, createdAt: $createdAt, likes: $likes, viewers: $viewers, isLikedByMe: $isLikedByMe)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Story &&
        other.publisherId == publisherId &&
        other.id == id &&
        other.createdAt == createdAt &&
        other.likes == likes &&
        other.viewers == viewers &&
        other.isLikedByMe == isLikedByMe;
  }

  @override
  int get hashCode {
    return publisherId.hashCode ^
        id.hashCode ^
        createdAt.hashCode ^
        likes.hashCode ^
        viewers.hashCode ^
        isLikedByMe.hashCode;
  }
}
