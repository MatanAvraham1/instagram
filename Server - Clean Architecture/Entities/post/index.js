import { buildMakePost } from "./post_entity";
import { Id } from "../../CustomHelpers/Id_helper";
import { PhotosChecker } from "../../CustomHelpers/Photos_checker";
import { TextChecker } from "../../CustomHelpers/Text_checker";

export const makePost = buildMakePost({ Id, PhotosChecker, TextChecker })