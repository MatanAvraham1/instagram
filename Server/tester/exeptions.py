# 400
class BadRequestExeption(Exception):
    pass

# 401


class AuthorizationException(Exception):
    pass

# 403


class ForbiddenRequest(Exception):
    pass

# 404


class NotFoundException(Exception):
    pass

# 500


class ServerErrorException(Exception):
    pass
