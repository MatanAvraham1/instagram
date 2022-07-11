const { buildAddUser } = require("./add_user")
const { UsersDB } = require("../../Adapters/DB/users_db")
const { buildDeleteUserById } = require("./delete_user_by_id")
const { buildGetUserById } = require("./get_user_by_id")

const { Id } = require("../../CustomHelpers/Id_helper")
const { Username } = require("../../CustomHelpers/Username_helper")
const { Bio } = require("../../CustomHelpers/Bio_helper")
const { Fullname } = require("../../CustomHelpers/Fullname_helper")


const { buildFollowUser } = require("./follow_user")
const { buildUnfollowUser } = require("./unfollow_user")
const { buildAcceptFollowRequest } = require("./accept_follow_request")
const { buildDeclineFollowRequest } = require("./decline_follow_request")
const { AppError, AppErrorMessages } = require("../../app_error")
const { buildGetFollowers } = require("./get_followers")
const { buildGetFollowings } = require("./get_followings")
const { buildUpdateFields } = require("./update_fields")
const { buildGetUserByUsername } = require("./get_user_by_username")
const { buildGetUserByFullname } = require("./get_user_by_fullname")
const { buildIsFollow } = require('./is_follow')
const { buildIsRequest } = require("./is_request")

const addUser = buildAddUser({ UsersDB })
const deleteUserById = buildDeleteUserById({ UsersDB, Id, AppError, AppErrorMessages })
const getUserById = buildGetUserById({ UsersDB, Id, AppError, AppErrorMessages })
const getUserByUsername = buildGetUserByUsername({ UsersDB, Username, AppError, AppErrorMessages })
const getUserByFullname = buildGetUserByFullname({ UsersDB, Fullname, AppError, AppErrorMessages })


const followUser = buildFollowUser({ UsersDB, Id, AppError, AppErrorMessages })
const unfollowUser = buildUnfollowUser({ UsersDB, Id, AppError, AppErrorMessages })
const acceptFollowRequest = buildAcceptFollowRequest({ UsersDB, Id, AppError, AppErrorMessages })
const declineFollowRequest = buildDeclineFollowRequest({ UsersDB, Id, AppError, AppErrorMessages })

const getFollowers = buildGetFollowers({ UsersDB, Id, AppError, AppErrorMessages })
const getFollowings = buildGetFollowings({ UsersDB, Id, AppError, AppErrorMessages })

const updateFields = buildUpdateFields({ UsersDB, Id, Username, Fullname, Bio, AppError, AppErrorMessages })

const isFollow = buildIsFollow({ UsersDB, Id, AppError, AppErrorMessages })
const isRequest = buildIsRequest({ UsersDB, Id, AppError, AppErrorMessages })

module.exports = { addUser, deleteUserById, getUserById, followUser, unfollowUser, acceptFollowRequest, declineFollowRequest, getFollowers, getFollowings, updateFields, getUserByUsername, getUserByFullname, isFollow, isRequest }