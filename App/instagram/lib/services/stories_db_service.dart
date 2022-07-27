import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/models/story_model.dart';
import 'package:instagram/services/ServerIP.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:instagram/services/online_db_service.dart';

class StoriesDBService extends OnlineDBService {
  static final StoriesDBService _storiesDBService =
      StoriesDBService._internal();

  factory StoriesDBService() {
    return _storiesDBService;
  }

  StoriesDBService._internal();

  Future uploadStory(Story story) async {
    /*
    Uploads new story

    param 1: the story
    */

    var response = await http.post(
      Uri.parse(SERVER_API_URL + "stories"),
      headers: {
        'Content-type': 'application/json',
        "authorization": AuthService().getAuthorizationHeader(),
      },
      body: jsonEncode({
        'structure': story.structure,
      }),
    );

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);
  }

  Future<Story> getStory(String storyId) async {
    /*
    Returns some story

    param 1: the id of the story
    */

    var response = await http
        .get(Uri.parse(SERVER_API_URL + "stories/$storyId"), headers: {
      "authorization": AuthService().getAuthorizationHeader(),
    });

    checkErrors(response, ServerExceptionMessages.storyDoesNotExist);

    var story = Story.fromJson(jsonDecode(response.body));
    return story;
  }

  Future deleteStory(String storyId) async {
    /*
    Deletes story

    param 1: the story id
    */

    var response = await http
        .delete(Uri.parse(SERVER_API_URL + "stories/$storyId"), headers: {
      "authorization": AuthService().getAuthorizationHeader(),
    });

    checkErrors(response, ServerExceptionMessages.storyDoesNotExist);
  }

  Future<List<Story>> getLastDayStories(
      String publisherId, int startIndex) async {
    /*
    Returns all the stories of [publisherId] from the last day

    param 1: the publisher id
    param 2: how much stories have we already load
    */

    var response = await http.get(
        Uri.parse(SERVER_API_URL +
            "stories?startIndex=$startIndex&publisherId=$publisherId"),
        headers: {
          "authorization": AuthService().getAuthorizationHeader(),
        });

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);

    List<Story> stories = [];
    for (var storyObject in jsonDecode(response.body)) {
      Story story = Story.fromMap(storyObject);
      stories.add(story);
    }
    return stories;
  }

  Future<List<Story>> getStoriesArchive(int startIndex) async {
    /*
    Returns the stories archive
    */

    var response = await http.get(
        Uri.parse(SERVER_API_URL + "stories/archive?startIndex=$startIndex"),
        headers: {
          "authorization": AuthService().getAuthorizationHeader(),
        });

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);

    List<Story> stories = [];
    for (var storyObject in jsonDecode(response.body)) {
      Story story = Story.fromJson(storyObject);
      stories.add(story);
    }
    return stories;
  }

  Future likeStory(String storyId) async {
    /*
    Likes story

    param 1: the id of the story
    */

    var response = await http.post(
      Uri.parse(SERVER_API_URL + "stories/$storyId/like"),
      headers: {
        'Content-type': 'application/json',
        "authorization": AuthService().getAuthorizationHeader(),
      },
    );

    checkErrors(response, ServerExceptionMessages.storyDoesNotExist);
  }

  Future unlikeStory(String storyId) async {
    /*
    Unlikes story

    param 1: the id of the story
    */

    var response = await http.post(
      Uri.parse(SERVER_API_URL + "stories/$storyId/unlike"),
      headers: {
        'Content-type': 'application/json',
        "authorization": AuthService().getAuthorizationHeader(),
      },
    );

    checkErrors(response, ServerExceptionMessages.storyDoesNotExist);
  }
}
