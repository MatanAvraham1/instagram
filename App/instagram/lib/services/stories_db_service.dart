import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/models/story_model.dart';
import 'package:instagram/services/ServerIP.dart';
import 'package:instagram/services/auth_service.dart';

class StoriesDBService {
  static Future uploadStory(Story story) async {
    /*
    Uploads new story

    param 1: the story
    */

    var response = await http.post(
      Uri.parse(SERVER_API_URL + "stories"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
      body: jsonEncode({
        'structure': story.structure,
      }),
    );

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.userDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }
  }

  static Future<Story> getStory(String storyId) async {
    /*
    Returns some story

    param 1: the id of the story
    */

    var response = await http
        .get(Uri.parse(SERVER_API_URL + "stories/$storyId"), headers: {
      "authorization": await AuthSerivce.getAuthorizationHeader(),
    });

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.storyDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }

    var story = Story.fromJson(jsonDecode(response.body));
    return story;
  }

  static Future deleteStory(String storyId) async {
    /*
    Deletes story

    param 1: the story id
    */

    var response = await http
        .delete(Uri.parse(SERVER_API_URL + "stories/$storyId"), headers: {
      "authorization": await AuthSerivce.getAuthorizationHeader(),
    });

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.storyDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }
  }

  static Future<List<Story>> getLastDayStories(
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
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.userDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }

    List<Story> stories = [];
    for (var storyObject in jsonDecode(response.body)) {
      Story story = Story.fromMap(storyObject);
      stories.add(story);
    }
    return stories;
  }

  static Future<List<Story>> getStoriesArchive(int startIndex) async {
    /*
    Returns the stories archive
    */

    var response = await http.get(
        Uri.parse(SERVER_API_URL + "stories/archive?startIndex=$startIndex"),
        headers: {
          "authorization": await AuthSerivce.getAuthorizationHeader(),
        });

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.userDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }

    List<Story> stories = [];
    for (var storyObject in jsonDecode(response.body)) {
      Story story = Story.fromJson(storyObject);
      stories.add(story);
    }
    return stories;
  }

  static Future likeStory(String storyId) async {
    /*
    Likes story

    param 1: the id of the story
    */

    var response = await http.post(
      Uri.parse(SERVER_API_URL + "stories/$storyId/like"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);
      ;

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.storyDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }
  }

  static Future unlikeStory(String storyId) async {
    /*
    Unlikes story

    param 1: the id of the story
    */

    var response = await http.post(
      Uri.parse(SERVER_API_URL + "stories/$storyId/unlike"),
      headers: {
        'Content-type': 'application/json',
        "authorization": await AuthSerivce.getAuthorizationHeader(),
      },
    );

    if (response.statusCode == 400) {
      var errorMessage = jsonDecode(response.body);
      ;

      throw ServerException(errorMessage);
    }
    if (response.statusCode == 401) {
      throw ServerException(ServerExceptionMessages.unauthorizedrequest);
    }
    if (response.statusCode == 403) {
      throw ServerException(ServerExceptionMessages.forbiddenRequest);
    }
    if (response.statusCode == 404) {
      throw ServerException(ServerExceptionMessages.storyDoesNotExist);
    }
    if (response.statusCode == 500) {
      throw ServerException(ServerExceptionMessages.serverError);
    }
  }
}
