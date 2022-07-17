import 'dart:convert';

import 'package:instagram/services/ServerIP.dart';

class User {
  String id;
  String username;
  String fullname;
  String bio;
  String profilePhoto;
  bool isPrivate;

  int followers;
  int followings;
  int posts;

  int? followRequests;
  int? followingRequests;

  int? stories; // Archive
  int? lastDayStories;

  bool isFollowedByMe;
  bool isFollowMe;
  bool isRequestedByMe;
  bool isRequestMe;

  DateTime? createdAt;

  User({
    required this.id,
    required this.username,
    required this.fullname,
    required this.bio,
    required this.profilePhoto,
    required this.isPrivate,
    required this.followers,
    required this.followings,
    required this.posts,
    this.followRequests,
    this.followingRequests,
    this.stories,
    this.lastDayStories,
    required this.isFollowedByMe,
    required this.isFollowMe,
    required this.isRequestedByMe,
    required this.isRequestMe,
    this.createdAt,
  });

  User copyWith({
    String? id,
    String? username,
    String? fullname,
    String? bio,
    String? profilePhoto,
    bool? isPrivate,
    int? followers,
    int? followings,
    int? posts,
    int? followRequests,
    int? followingRequests,
    int? stories,
    int? lastDayStories,
    bool? isFollowedByMe,
    bool? isFollowMe,
    bool? isRequestedByMe,
    bool? isRequestMe,
    DateTime? createdAt,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      fullname: fullname ?? this.fullname,
      bio: bio ?? this.bio,
      profilePhoto: profilePhoto ?? this.profilePhoto,
      isPrivate: isPrivate ?? this.isPrivate,
      followers: followers ?? this.followers,
      followings: followings ?? this.followings,
      posts: posts ?? this.posts,
      followRequests: followRequests ?? this.followRequests,
      followingRequests: followingRequests ?? this.followingRequests,
      stories: stories ?? this.stories,
      lastDayStories: lastDayStories ?? this.lastDayStories,
      isFollowedByMe: isFollowedByMe ?? this.isFollowedByMe,
      isFollowMe: isFollowMe ?? this.isFollowMe,
      isRequestedByMe: isRequestedByMe ?? this.isRequestedByMe,
      isRequestMe: isRequestMe ?? this.isRequestMe,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'username': username,
      'fullname': fullname,
      'bio': bio,
      'profilePhoto': profilePhoto,
      'isPrivate': isPrivate,
      'followers': followers,
      'followings': followings,
      'posts': posts,
      'followRequests': followRequests,
      'followingRequests': followingRequests,
      'stories': stories,
      'lastDayStories': lastDayStories,
      'isFollowedByMe': isFollowedByMe,
      'isFollowMe': isFollowMe,
      'isRequestedByMe': isRequestedByMe,
      'isRequestMe': isRequestMe,
      'createdAt': createdAt?.millisecondsSinceEpoch,
    };
  }

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'] ?? '',
      username: map['username'] ?? '',
      fullname: map['fullname'] ?? '',
      bio: map['bio'] ?? '',
      profilePhoto: map['profilePhoto'] != null
          ? "${SERVER_API_URL}users/${map['id']}/${map['profilePhoto']}"
          : 'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
      isPrivate: map['isPrivate'] ?? false,
      followers: map['followers']?.toInt() ?? 0,
      followings: map['followings']?.toInt() ?? 0,
      posts: map['posts']?.toInt() ?? 0,
      followRequests: map['followRequests']?.toInt(),
      followingRequests: map['followingRequests']?.toInt(),
      stories: map['stories']?.toInt(),
      lastDayStories: map['lastDayStories']?.toInt(),
      isFollowedByMe: map['isFollowedByMe'] ?? false,
      isFollowMe: map['isFollowMe'] ?? false,
      isRequestedByMe: map['isRequestedByMe'] ?? false,
      isRequestMe: map['isRequestMe'] ?? false,
      createdAt:
          map['createdAt'] != null ? DateTime.parse(map['createdAt']) : null,
    );
  }

  String toJson() => json.encode(toMap());

  factory User.fromJson(String source) => User.fromMap(json.decode(source));

  @override
  String toString() {
    return 'User(id: $id, username: $username, fullname: $fullname, bio: $bio, profilePhoto: $profilePhoto, isPrivate: $isPrivate, followers: $followers, followings: $followings, posts: $posts, followRequests: $followRequests, followingRequests: $followingRequests, stories: $stories, lastDayStories: $lastDayStories, isFollowedByMe: $isFollowedByMe, isFollowMe: $isFollowMe, isRequestedByMe: $isRequestedByMe, isRequestMe: $isRequestMe, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is User &&
        other.id == id &&
        other.username == username &&
        other.fullname == fullname &&
        other.bio == bio &&
        other.profilePhoto == profilePhoto &&
        other.isPrivate == isPrivate &&
        other.followers == followers &&
        other.followings == followings &&
        other.posts == posts &&
        other.followRequests == followRequests &&
        other.followingRequests == followingRequests &&
        other.stories == stories &&
        other.lastDayStories == lastDayStories &&
        other.isFollowedByMe == isFollowedByMe &&
        other.isFollowMe == isFollowMe &&
        other.isRequestedByMe == isRequestedByMe &&
        other.isRequestMe == isRequestMe &&
        other.createdAt == createdAt;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        username.hashCode ^
        fullname.hashCode ^
        bio.hashCode ^
        profilePhoto.hashCode ^
        isPrivate.hashCode ^
        followers.hashCode ^
        followings.hashCode ^
        posts.hashCode ^
        followRequests.hashCode ^
        followingRequests.hashCode ^
        stories.hashCode ^
        lastDayStories.hashCode ^
        isFollowedByMe.hashCode ^
        isFollowMe.hashCode ^
        isRequestedByMe.hashCode ^
        isRequestMe.hashCode ^
        createdAt.hashCode;
  }
}
