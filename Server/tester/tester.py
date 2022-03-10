from typing import final
from tester.requests import *
from tester.exeptions import *


def testRegister():
    register("matan", "avraham")

    try:
        register("matan", "avraham")
        return False
    except BadRequestExeption:
        return True
    finally:
        deleteUser("matan", "avraham")


def testLogin():
    register("matan", "avraham")
    try:
        login("matan", "avraham")
    except Exception:
        return False

    try:
        login('dfsads', "dsadsa")
        return False
    except NotFoundException:
        return True
    finally:
        deleteUser("matan", "avraham")


def testPosts():


def testProgram():
    if testRegister():
        print("Register Ok!")

    if testLogin():
        print("Login Ok!")

    if testPosts():
        print("Post creating/deleting/likign Ok!")


def main():
    testProgram()


if(__name__ == "__main__"):
    main()
