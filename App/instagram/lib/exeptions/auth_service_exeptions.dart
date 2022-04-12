abstract class AuthServiceExeption implements Exception {}

class UsernameAlreadyUsedExeption implements AuthServiceExeption {}

class InvalidUsernameOrPasswordExeption implements AuthServiceExeption {}

class WrongUsernameOrPasswordExeption implements AuthServiceExeption {}

class NoUserLoggedInExeption implements AuthServiceExeption {}
