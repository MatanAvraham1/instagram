abstract class OnlineDBServiceExeption implements Exception {}

class ForbiddenExeption implements OnlineDBServiceExeption {}

class InvalidPostExeption implements OnlineDBServiceExeption {}

class PostNotExistExeption implements OnlineDBServiceExeption {}

class UserNotExistExeption implements OnlineDBServiceExeption {}

class CommentNotExistExeption implements OnlineDBServiceExeption {}

class InvalidCommentExeption implements OnlineDBServiceExeption {}

class InvalidUpdateValuesExeption implements OnlineDBServiceExeption {}

class UserCantFollowHimselfExeption implements OnlineDBServiceExeption {}

class UserAlreadyFollowedExeption implements OnlineDBServiceExeption {}

class UserAlreadyUnfollowedExeption implements OnlineDBServiceExeption {}

class FollowRequestAlreadySentExeption implements OnlineDBServiceExeption {}

class MissingUserToAcceptExeption implements OnlineDBServiceExeption {}

class MissingUserToDeleteExeption implements OnlineDBServiceExeption {}

class UserNotInFollowRequestsExeption implements OnlineDBServiceExeption {}
