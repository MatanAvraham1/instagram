import { storiesDb } from "../../Adapters/DB/stories_db";
import { buildAddStory } from "./add_story"
import { buildDeleteStoryById } from "./delete_story_by_id"
import { buildGetStoryByid } from "./get_story_by_id"

export const addStory = buildAddStory({ storiesDb })
export const deleteStoryById = buildDeleteStoryById({ storiesDb })
export const getStoryById = buildGetStoryByid({ storiesDb })