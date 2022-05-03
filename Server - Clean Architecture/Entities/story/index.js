import { Id } from "../../CustomHelpers/Id_helper";
import { StoryStructure } from "../../CustomHelpers/Story_Structure";
import { buildMakeStory } from "./story_entity";

export const makeStory = buildMakeStory({ Id, StoryStructure })