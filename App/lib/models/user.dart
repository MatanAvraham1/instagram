import 'dart:convert';

class User {
  String id;
  String username;
  String fullname;
  String bio;
  String photoUrl;
  bool isPrivate;

  int followers;
  int followings;
  int posts;
  int stories;

  bool isFollowedByMe;
  bool isFollowMe;
  bool isRequestedByMe;

  User({
    required this.id,
    required this.username,
    required this.fullname,
    required this.bio,
    required this.photoUrl,
    required this.isPrivate,
    required this.followers,
    required this.followings,
    required this.posts,
    required this.stories,
    required this.isFollowedByMe,
    required this.isFollowMe,
    required this.isRequestedByMe,
  });

  User copyWith({
    String? id,
    String? username,
    String? fullname,
    String? bio,
    String? photoUrl,
    bool? isPrivate,
    int? followers,
    int? followings,
    int? posts,
    int? stories,
    bool? isFollowedByMe,
    bool? isFollowMe,
    bool? isRequestedByMe,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      fullname: fullname ?? this.fullname,
      bio: bio ?? this.bio,
      photoUrl: photoUrl ?? this.photoUrl,
      isPrivate: isPrivate ?? this.isPrivate,
      followers: followers ?? this.followers,
      followings: followings ?? this.followings,
      posts: posts ?? this.posts,
      stories: stories ?? this.stories,
      isFollowedByMe: isFollowedByMe ?? this.isFollowedByMe,
      isFollowMe: isFollowMe ?? this.isFollowMe,
      isRequestedByMe: isRequestedByMe ?? this.isRequestedByMe,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'username': username,
      'fullname': fullname,
      'bio': bio,
      'photoUrl': photoUrl,
      'isPrivate': isPrivate,
      'followers': followers,
      'followings': followings,
      'posts': posts,
      'stories': stories,
      'isFollowedByMe': isFollowedByMe,
      'isFollowMe': isFollowMe,
      'isRequestedByMe': isRequestedByMe,
    };
  }

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'] ?? '',
      username: map['username'] ?? '',
      fullname: map['fullname'] ?? '',
      bio: map['bio'] ?? '',
      photoUrl: map['photoUrl'] ?? '',
      isPrivate: map['isPrivate'] ?? false,
      followers: map['followers']?.toInt() ?? 0,
      followings: map['followings']?.toInt() ?? 0,
      posts: map['posts']?.toInt() ?? 0,
      stories: map['stories']?.toInt() ?? 0,
      isFollowedByMe: map['isFollowedByMe'] ?? false,
      isFollowMe: map['isFollowMe'] ?? false,
      isRequestedByMe: map['isRequestedByMe'] ?? false,
    );
  }

  String toJson() => json.encode(toMap());

  factory User.fromJson(String source) => User.fromMap(json.decode(source));

  @override
  String toString() {
    return 'User(id: $id, username: $username, fullname: $fullname, bio: $bio, photoUrl: $photoUrl, isPrivate: $isPrivate, followers: $followers, followings: $followings, posts: $posts, stories: $stories, isFollowedByMe: $isFollowedByMe, isFollowMe: $isFollowMe, isRequestedByMe: $isRequestedByMe)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is User &&
        other.id == id &&
        other.username == username &&
        other.fullname == fullname &&
        other.bio == bio &&
        other.photoUrl == photoUrl &&
        other.isPrivate == isPrivate &&
        other.followers == followers &&
        other.followings == followings &&
        other.posts == posts &&
        other.stories == stories &&
        other.isFollowedByMe == isFollowedByMe &&
        other.isFollowMe == isFollowMe &&
        other.isRequestedByMe == isRequestedByMe;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        username.hashCode ^
        fullname.hashCode ^
        bio.hashCode ^
        photoUrl.hashCode ^
        isPrivate.hashCode ^
        followers.hashCode ^
        followings.hashCode ^
        posts.hashCode ^
        stories.hashCode ^
        isFollowedByMe.hashCode ^
        isFollowMe.hashCode ^
        isRequestedByMe.hashCode;
  }
}
