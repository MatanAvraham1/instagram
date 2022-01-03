import 'dart:convert';

class Comment {
  String comment;
  String postId;
  String publisherId;
  DateTime publishedAt;
  int likes;

  Comment({
    required this.comment,
    required this.postId,
    required this.publisherId,
    required this.publishedAt,
    required this.likes,
  });

  get owner {
    return null;
  }

  Comment copyWith({
    String? comment,
    String? postId,
    String? publisherId,
    DateTime? publishedAt,
    int? likes,
  }) {
    return Comment(
      comment: comment ?? this.comment,
      postId: postId ?? this.postId,
      publisherId: publisherId ?? this.publisherId,
      publishedAt: publishedAt ?? this.publishedAt,
      likes: likes ?? this.likes,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'comment': comment,
      'postId': postId,
      'publisherId': publisherId,
      'publishedAt': publishedAt.millisecondsSinceEpoch,
      'likes': likes,
    };
  }

  factory Comment.fromMap(Map<String, dynamic> map) {
    return Comment(
      comment: map['comment'] ?? '',
      postId: map['postId'] ?? '',
      publisherId: map['publisherId'] ?? '',
      publishedAt: DateTime.fromMillisecondsSinceEpoch(map['publishedAt']),
      likes: map['likes']?.toInt() ?? 0,
    );
  }

  String toJson() => json.encode(toMap());

  factory Comment.fromJson(String source) =>
      Comment.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Comment(comment: $comment, postId: $postId, publisherId: $publisherId, publishedAt: $publishedAt, likes: $likes)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Comment &&
        other.comment == comment &&
        other.postId == postId &&
        other.publisherId == publisherId &&
        other.publishedAt == publishedAt &&
        other.likes == likes;
  }

  @override
  int get hashCode {
    return comment.hashCode ^
        postId.hashCode ^
        publisherId.hashCode ^
        publishedAt.hashCode ^
        likes.hashCode;
  }
}
