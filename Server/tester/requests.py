from tester.exeptions import *
import requests

URL = "http://127.0.0.1:5000/api/"


def checkStatusCode(STATUS_CODE):

    if(STATUS_CODE == 400):
        raise BadRequestExeption()

    if(STATUS_CODE == 401):
        raise AuthorizationException()

    if(STATUS_CODE == 403):
        raise ForbiddenRequest()

    if(STATUS_CODE == 404):
        raise NotFoundException()

    if(STATUS_CODE == 500):
        raise ServerErrorException()


def register(USERNAME, PASSWORD):
    # Register

    body = {"username": USERNAME, "password": PASSWORD}
    response = requests.post(f"{URL}register/", json=body)

    checkStatusCode()

    return response.json()["jwt"], response.json()["userId"]


def login(USERNAME, PASSWORD):
    # Login

    body = {"username": USERNAME, "password": PASSWORD}
    response = requests.post(f"{URL}login/", json=body)

    checkStatusCode()

    return response.json()["jwt"], response.json()["userId"]


def getUser(USER_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.get(
        f"{URL}users/{USER_ID}?searchBy=byId", headers=headers)

    checkStatusCode()

    return response.json()


def updateUser(USER_ID, AUTHORIZATION, BIO, FULL_NAME, PHOTO_URL, IS_PRIVATE):
    updateFields = {
        "bio": BIO,
        "fullname": FULL_NAME,
        "photoUrl": PHOTO_URL,
        "isPrivate": IS_PRIVATE,
    }
    headers = {"authorization": AUTHORIZATION}
    response = requests.patch(
        f"{URL}users/{USER_ID}", headers=headers, json=updateFields)

    checkStatusCode()


def deleteUser(USER_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.delete(
        f"{URL}users/{USER_ID}", headers=headers)

    checkStatusCode()


def createPost(USER_ID, AUTHORIZATION):
    post = {"publisherComment": "hello this is my post!",
            "location": "Tel aviv",
            "photosUrls": ['https:3232', "http:wewadas"],
            "taggedUsers": ['dsadsda', 'dsadsadsada']
            }
    headers = {"authorization": AUTHORIZATION}
    response = requests.post(
        f"{URL}users/{USER_ID}/posts", json=post, headers=headers)

    checkStatusCode()

    return response.json()["postId"]


def likePost(USER_ID, POST_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.post(
        f"{URL}users/{USER_ID}/posts/{POST_ID}/likes", headers=headers)

    checkStatusCode()


def unlikePost(USER_ID, POST_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.delete(
        f"{URL}users/{USER_ID}/posts/{POST_ID}/likes", headers=headers)

    checkStatusCode()


def getPost(USER_ID, POST_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.get(
        f"{URL}users/{USER_ID}/posts/{POST_ID}", headers=headers)

    checkStatusCode()

    return response.json()


def deletePost(USER_ID, POST_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.delete(
        f"{URL}users/{USER_ID}/posts/{POST_ID}", headers=headers)

    checkStatusCode()


def createStory(USER_ID, AUTHORIZATION):
    post = {
        "photoUrl": "https:3232",
    }
    headers = {"authorization": AUTHORIZATION}
    response = requests.post(
        f"{URL}users/{USER_ID}/stories", json=post, headers=headers)

    checkStatusCode()
    return response.json()["storyId"]


def getStory(USER_ID, STORY_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.get(
        f"{URL}users/{USER_ID}/stories/{STORY_ID}", headers=headers)

    checkStatusCode()
    return response.json()


def deleteStory(USER_ID, STORY_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.delete(
        f"{URL}users/{USER_ID}/stories/{STORY_ID}", headers=headers)

    checkStatusCode()


def createComment(USER_ID, POST_ID, AUTHORIZATION):
    comment = {
        "comment": "hihihi!!!!!!!!",
    }
    headers = {"authorization": AUTHORIZATION}
    response = requests.post(
        f"{URL}users/{USER_ID}/posts/{POST_ID}/comments", json=comment, headers=headers)

    checkStatusCode()
    return response.json()["commentId"]


def likeComment(USER_ID, POST_ID, COMMENT_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.post(
        f"{URL}users/{USER_ID}/posts/{POST_ID}/comments/{COMMENT_ID}/likes", headers=headers)

    checkStatusCode()


def unlikeComment(USER_ID, POST_ID, COMMENT_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.delete(
        f"{URL}users/{USER_ID}/posts/{POST_ID}/comments/{COMMENT_ID}/likes", headers=headers)

    checkStatusCode()


def getComment(USER_ID, POST_ID, COMMENT_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.get(
        f"{URL}users/{USER_ID}/posts/{POST_ID}/comments/{COMMENT_ID}", headers=headers)

    checkStatusCode()
    return response.json()


def deleteComment(USER_ID, POST_ID, COMMENT_ID, AUTHORIZATION):
    headers = {"authorization": AUTHORIZATION}
    response = requests.delete(
        f"{URL}users/{USER_ID}/posts/{POST_ID}/comments/{COMMENT_ID}", headers=headers)

    checkStatusCode()


def getComments(USER_ID, POST_ID, AUTHORIZATION):
    comments = []
    startFrom = 0

    for i in range(10):
        headers = {"authorization": AUTHORIZATION}
        response = requests.get(
            f"{URL}users/{USER_ID}/posts/{POST_ID}/comments?startFrom={startFrom}", headers=headers)

        checkStatusCode()

        for comment in response.json():
            comments.append(comment)

        startFrom = len(comments)

    return comments


def getPosts(USER_ID, AUTHORIZATION):
    posts = []
    startFrom = 0

    for i in range(10):
        headers = {"authorization": AUTHORIZATION}
        response = requests.get(
            f"{URL}users/{USER_ID}/posts?startFrom={startFrom}", headers=headers)

        checkStatusCode()

        for post in response.json():
            posts.append(post)

        startFrom = len(posts)

    return posts


def getFollowers(USER_ID, AUTHORIZATION):
    followers = []
    startFrom = 0

    for i in range(10):
        headers = {"authorization": AUTHORIZATION}
        response = requests.get(
            f"{URL}users/{USER_ID}/followers?startFrom={startFrom}", headers=headers)

        checkStatusCode()

        for follower in response.json():
            followers.append(follower)

        startFrom = len(followers)

    return followers


def getFollowings(USER_ID, AUTHORIZATION):
    followings = []
    startFrom = 0

    for i in range(10):
        headers = {"authorization": AUTHORIZATION}
        response = requests.get(
            f"{URL}users/{USER_ID}/followings?startFrom={startFrom}", headers=headers)

        checkStatusCode()

        for following in response.json():
            followings.append(following)

        startFrom = len(followings)

    return followings


def getStoriesFromLast24Hours(USER_ID, AUTHORIZATION):
    stories = []

    for i in range(10):
        headers = {"authorization": AUTHORIZATION}
        response = requests.get(
            f"{URL}users/{USER_ID}/stories", headers=headers)

        checkStatusCode()
        for story in response.json():
            stories.append(story)

    return stories


def getStoriesArchive(USER_ID, AUTHORIZATION):
    archive = []
    startFrom = 0

    for i in range(10):
        headers = {"authorization": AUTHORIZATION}
        response = requests.get(
            f"{URL}users/{USER_ID}/stories/archive?startFrom={startFrom}", headers=headers)

        checkStatusCode()
        for story in response.json():
            archive.append(story)

        startFrom = len(archive)

    return archive


def followUser(SECOND_USER_ID, FIRST_USER_AUTHORIZATION):
    headers = {"authorization": FIRST_USER_AUTHORIZATION}
    response = requests.post(
        f"{URL}users/{SECOND_USER_ID}/followers", headers=headers)

    checkStatusCode()


def unfollowUser(SECOND_USER_ID, FIRST_USER_AUTHORIZATION):
    headers = {"authorization": FIRST_USER_AUTHORIZATION}
    response = requests.delete(
        f"{URL}users/{SECOND_USER_ID}/followers", headers=headers)

    checkStatusCode()
