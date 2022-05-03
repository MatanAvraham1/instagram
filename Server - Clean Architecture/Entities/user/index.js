import { buildMakeUser } from "./user_entity";
import { Id } from "../../CustomHelpers/Id_helper";
import { Password } from "../../CustomHelpers/Password_helper";
import { Username } from "../../CustomHelpers/Username_helper";

export const makeUser = buildMakeUser({ Id, Password, Username })