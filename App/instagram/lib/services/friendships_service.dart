import 'package:http/http.dart' as http;
import 'package:instagram/exeptions/server_exceptions.dart';
import 'package:instagram/services/ServerIP.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:instagram/services/online_db_service.dart';

class FriendshipsService extends OnlineDBService {
  static final FriendshipsService _friendshipsService =
      FriendshipsService._internal();

  factory FriendshipsService() {
    return _friendshipsService;
  }

  FriendshipsService._internal();

  Future followUser(String userId) async {
    /*
    Follows user

    param 1: the id of the user
    */

    var response = await http.post(
      Uri.parse("${SERVER_API_URL}friendships/follow?userToFollow=$userId"),
      headers: {
        "authorization": AuthService().getAuthorizationHeader(),
      },
    );

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);
  }

  Future unfollowUser(String userId) async {
    /*
    Unfollows user

    param 1: the id of the user
    */

    var response = await http.post(
      Uri.parse("${SERVER_API_URL}friendships/unfollow?userToUnfollow=$userId"),
      headers: {
        "authorization": AuthService().getAuthorizationHeader(),
      },
    );

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);
  }

  Future acceptFollowRequest(String userToAccept) async {
    /*
    Accepts follow request

    param 1: the id of the user to accept
    */

    var response = await http.post(
      Uri.parse("${SERVER_API_URL}friendships/acceptRequest?userToAccept=$userToAccept"),
      headers: {
        "authorization": AuthService().getAuthorizationHeader(),
      },
    );

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);
  }

  Future declineFollowRequest(String userToDecline) async {
    /*
    Declines follow request

    param 1: the id of the user to decline
    */

    var response = await http.post(
      Uri.parse("${SERVER_API_URL}friendships/declineRequest?userToDecline=$userToDecline"),
      headers: {
        "authorization": AuthService().getAuthorizationHeader(),
      },
    );

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);
  }

  Future deleteFollowingRequest(String requestToDelete) async {
    /*
    Deletes following request

    param 1: the id of the request to delete
    */

    var response = await http.delete(
      Uri.parse("${SERVER_API_URL}friendships/deleteRequest?userToDelete=$requestToDelete"),
      headers: {
        "authorization": AuthService().getAuthorizationHeader(),
      },
    );

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);
  }

  Future removeUserFromFollowers(String userToRemove) async {
    /*
    Removes user from my followers

    param 1: the id of the user to remove
    */

    var response = await http.delete(
      Uri.parse("${SERVER_API_URL}friendships/removeFollower?userToRemove=$userToRemove"),
      headers: {
        "authorization": AuthService().getAuthorizationHeader(),
      },
    );

    checkErrors(response, ServerExceptionMessages.userDoesNotExist);
  }
}
