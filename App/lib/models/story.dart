import 'dart:convert';

class Story {
  String photoUrl;
  String id;
  DateTime publishedAt;
  String ownerUid;

  Story({
    required this.photoUrl,
    required this.id,
    required this.publishedAt,
    required this.ownerUid,
  });

  Story copyWith({
    String? photoUrl,
    String? id,
    DateTime? publishedAt,
    String? ownerUid,
  }) {
    return Story(
      photoUrl: photoUrl ?? this.photoUrl,
      id: id ?? this.id,
      publishedAt: publishedAt ?? this.publishedAt,
      ownerUid: ownerUid ?? this.ownerUid,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'photoUrl': photoUrl,
      'id': id,
      'publishedAt': publishedAt.millisecondsSinceEpoch,
      'ownerUid': ownerUid,
    };
  }

  factory Story.fromMap(Map<String, dynamic> map) {
    return Story(
      photoUrl: map['photoUrl'] ?? '',
      id: map['id'] ?? '',
      publishedAt: DateTime.parse(map['publishedAt']),
      ownerUid: map['ownerUid'] ?? '',
    );
  }

  String toJson() => json.encode(toMap());

  factory Story.fromJson(String source) => Story.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Story(photoUrl: $photoUrl, id: $id, publishedAt: $publishedAt, ownerUid: $ownerUid)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Story &&
        other.photoUrl == photoUrl &&
        other.id == id &&
        other.publishedAt == publishedAt &&
        other.ownerUid == ownerUid;
  }

  @override
  int get hashCode {
    return photoUrl.hashCode ^
        id.hashCode ^
        publishedAt.hashCode ^
        ownerUid.hashCode;
  }
}
