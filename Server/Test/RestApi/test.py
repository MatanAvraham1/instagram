from glob import glob
import requests

URL = "http://127.0.0.1:5000/api/"

FIRST_USER_ID = None
SECOND_USER_ID = None

FIRST_USER_TOKEN = None
SECOND_USER_TOKEN = None

FIRST_USER_AUTH = None
SECOND_USER_AUTH = None


def register(username, password):
    response = requests.post(f"{URL}register", json={
        "username": username,
        "password": password
    })

    return response.json()["userId"], response.json()["jwt"]


def login(username, password):
    response = requests.post(f"{URL}login",  json={
        "username": username,
        "password": password
    })

    return response.json()["userId"], response.json()["jwt"]


def deleteUser(userId, auth):
    response = requests.delete(f"{URL}users/{userId}", headers=auth)
    if response.status_code != 200:
        raise Exception(
            f"Can't delete user : {userId} \n\nerror message : {response.text}")


def checkFollow():

    input("tap to follow...")

    # first follow second
    followUser(SECOND_USER_ID, FIRST_USER_AUTH)

    input("tap to unfollow...")

    # first unfollow second
    unfollowUser(SECOND_USER_ID, FIRST_USER_AUTH)

    input("tap to continue...")

    print("Follow ,Unfollow checks sucessed!")


def checkFollowOnPrivate():

    input("tap to make second private...")

    # makes the second private
    makeUserPrivate(SECOND_USER_ID, SECOND_USER_AUTH)

    input("tap to send follow request...")

    # Sends follow request
    followUser(SECOND_USER_ID, FIRST_USER_AUTH)

    input("tap to decline the request...")
    # second decline first
    declineFollow(FIRST_USER_ID, SECOND_USER_AUTH)

    input("tap to send follow request again...")
    # Sends follow request
    followUser(SECOND_USER_ID, FIRST_USER_AUTH)

    input("tap to accept the request...")
    # Seconds accept first
    acceptFollow(FIRST_USER_ID, SECOND_USER_AUTH)

    input("tap to unfollow...")
    # first unfollow second
    unfollowUser(SECOND_USER_ID, FIRST_USER_AUTH)

    input("tap to continue...")

    print("Follow, Unfollow, Accept, Decline checking succesd!")


def followUser(userToFollow, auth):
    # Makes first follow second
    response = requests.post(
        f"{URL}friendships/follow", params={"userToFollow": userToFollow}, headers=auth)

    if response.status_code != 200:
        raise Exception(
            f"Can't follow user : {userToFollow} \n\nerror message : {response.text}")


def unfollowUser(userToUnfollow, auth):
    # Makes first unfollow second
    response = requests.post(
        f"{URL}friendships/unfollow", params={"userToUnfollow": userToUnfollow}, headers=auth)

    if response.status_code != 200:
        raise Exception(
            f"Can't unfollow user : {userToUnfollow} \n\nerror message : {response.text}")


def makeUserPrivate(userId, auth):
    response = requests.patch(
        f"{URL}users/", json={"isPrivate": True}, headers=auth)

    if response.status_code != 200:
        raise Exception(
            f"Can't make user : {userId} private \n\nerror message : {response.text}")


def acceptFollow(userToAccept, auth):
    response = requests.post(
        f"{URL}friendships/acceptRequest", params={"userToAccept": userToAccept}, headers=auth)

    if response.status_code != 200:
        raise Exception(
            f"Can't accept user : {userToAccept} \n\nerror message : {response.text}")


def declineFollow(userToDecline, auth):
    response = requests.post(
        f"{URL}friendships/declineRequest", params={"userToDecline": userToDecline}, headers=auth)

    if response.status_code != 200:
        raise Exception(
            f"Can't decline user : {userToDecline} \n\nerror message : {response.text}")


def main():
    global FIRST_USER_ID, SECOND_USER_ID, FIRST_USER_TOKEN, SECOND_USER_TOKEN, FIRST_USER_AUTH, SECOND_USER_AUTH

    try:
        FIRST_USER_ID, FIRST_USER_TOKEN = register("matan", "avraham")
    except ValueError:
        print("First user already registered, just login...")

    try:
        SECOND_USER_ID, SECOND_USER_TOKEN = register("dvir", "twito")
    except ValueError:
        print("Second user already registered, just login...")

    FIRST_USER_ID, FIRST_USER_TOKEN = login("matan", "avraham")
    SECOND_USER_ID, SECOND_USER_TOKEN = login("dvir", "twito")

    FIRST_USER_AUTH = {"Authorization": f"Bearer {FIRST_USER_TOKEN}"}
    SECOND_USER_AUTH = {"Authorization": f"Bearer {SECOND_USER_TOKEN}"}

    print("Start regular follow checking")
    checkFollow()

    print("Start follow checking on private user")
    checkFollowOnPrivate()

    deleteUser(FIRST_USER_ID, FIRST_USER_AUTH)
    deleteUser(SECOND_USER_ID, SECOND_USER_AUTH)


if __name__ == "__main__":
    main()
