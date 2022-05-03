import { buildAddUser } from "./add_user";
import { usersDb } from "../../Adapters/DB/users_db";
import { buildDeleteUserById } from "./delete_user_by_id";
import { buildGetUserByid } from "./get_user_by_id";

export const addUser = buildAddUser({ usersDb })
export const deleteUserById = buildDeleteUserById({ usersDb })
export const getUserById = buildGetUserByid({ usersDb })