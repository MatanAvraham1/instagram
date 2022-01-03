import 'dart:convert';

class User {
  String userId;
  String username;
  String fullname;
  String bio;
  bool isPrivate;

  int followers;
  int following;
  int posts;
  User({
    required this.userId,
    required this.username,
    required this.fullname,
    required this.bio,
    required this.isPrivate,
    required this.followers,
    required this.following,
    required this.posts,
  });

  User copyWith({
    String? userId,
    String? username,
    String? fullname,
    String? bio,
    bool? isPrivate,
    int? followers,
    int? following,
    int? posts,
  }) {
    return User(
      userId: userId ?? this.userId,
      username: username ?? this.username,
      fullname: fullname ?? this.fullname,
      bio: bio ?? this.bio,
      isPrivate: isPrivate ?? this.isPrivate,
      followers: followers ?? this.followers,
      following: following ?? this.following,
      posts: posts ?? this.posts,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'username': username,
      'fullname': fullname,
      'bio': bio,
      'isPrivate': isPrivate,
      'followers': followers,
      'following': following,
      'posts': posts,
    };
  }

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      userId: map['userId'] ?? '',
      username: map['username'] ?? '',
      fullname: map['fullname'] ?? '',
      bio: map['bio'] ?? '',
      isPrivate: map['isPrivate'] ?? false,
      followers: map['followers']?.toInt() ?? 0,
      following: map['following']?.toInt() ?? 0,
      posts: map['posts']?.toInt() ?? 0,
    );
  }

  String toJson() => json.encode(toMap());

  factory User.fromJson(String source) => User.fromMap(json.decode(source));

  @override
  String toString() {
    return 'User(userId: $userId, username: $username, fullname: $fullname, bio: $bio, isPrivate: $isPrivate, followers: $followers, following: $following, posts: $posts)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is User &&
        other.userId == userId &&
        other.username == username &&
        other.fullname == fullname &&
        other.bio == bio &&
        other.isPrivate == isPrivate &&
        other.followers == followers &&
        other.following == following &&
        other.posts == posts;
  }

  @override
  int get hashCode {
    return userId.hashCode ^
        username.hashCode ^
        fullname.hashCode ^
        bio.hashCode ^
        isPrivate.hashCode ^
        followers.hashCode ^
        following.hashCode ^
        posts.hashCode;
  }
}
