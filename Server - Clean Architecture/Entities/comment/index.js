import { Id } from "../../CustomHelpers/Id_helper";
import { TextChecker } from "../../CustomHelpers/Text_checker";
import { buildMakeComment } from "./comment_entity";

export const makeComment = buildMakeComment({ Id, TextChecker })