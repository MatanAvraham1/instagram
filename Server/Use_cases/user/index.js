const { buildAddUser } = require("./add_user")
const { UsersDB } = require("../../Adapters/DB/users_db")
const { buildDeleteUserById } = require("./delete_user_by_id")
const { buildGetUserByid } = require("./get_user_by_id")

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
const { buildUpdateFields } = require("./update_fields")

const addUser = buildAddUser({ UsersDB })
const deleteUserById = buildDeleteUserById({ UsersDB, Id, AppError, AppErrorMessages })
const getUserById = buildGetUserByid({ UsersDB, Id, AppError, AppErrorMessages })


const followUser = buildFollowUser({ UsersDB, Id, AppError, AppErrorMessages })
const unfollowUser = buildUnfollowUser({ UsersDB, Id, AppError, AppErrorMessages })
const acceptFollowRequest = buildAcceptFollowRequest({ UsersDB, Id, AppError, AppErrorMessages })
const declineFollowRequest = buildDeclineFollowRequest({ UsersDB, Id, AppError, AppErrorMessages })

const getFollowers = buildGetFollowers({ UsersDB, Id, AppError, AppErrorMessages })

const updateFields = buildUpdateFields({ UsersDB, Id, Username, Fullname, Bio, AppError, AppErrorMessages })


module.exports = { addUser, deleteUserById, getUserById, followUser, unfollowUser, acceptFollowRequest, declineFollowRequest, getFollowers, updateFields }