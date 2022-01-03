import 'dart:convert';

class Story {
  String imageUrl;
  DateTime publishedAt;
  String ownerUid;
  Story({
    required this.imageUrl,
    required this.publishedAt,
    required this.ownerUid,
  });

  Story copyWith({
    String? imageUrl,
    DateTime? publishedAt,
    String? ownerUid,
  }) {
    return Story(
      imageUrl: imageUrl ?? this.imageUrl,
      publishedAt: publishedAt ?? this.publishedAt,
      ownerUid: ownerUid ?? this.ownerUid,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'imageUrl': imageUrl,
      'publishedAt': publishedAt.millisecondsSinceEpoch,
      'ownerUid': ownerUid,
    };
  }

  factory Story.fromMap(Map<String, dynamic> map) {
    return Story(
      imageUrl: map['imageUrl'],
      publishedAt: DateTime.fromMillisecondsSinceEpoch(map['publishedAt']),
      ownerUid: map['ownerUid'],
    );
  }

  String toJson() => json.encode(toMap());

  factory Story.fromJson(String source) => Story.fromMap(json.decode(source));

  @override
  String toString() =>
      'Story(imageUrl: $imageUrl, publishedAt: $publishedAt, ownerUid: $ownerUid)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Story &&
        other.imageUrl == imageUrl &&
        other.publishedAt == publishedAt &&
        other.ownerUid == ownerUid;
  }

  @override
  int get hashCode =>
      imageUrl.hashCode ^ publishedAt.hashCode ^ ownerUid.hashCode;
}
