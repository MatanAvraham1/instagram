const { storiesDb } = require("../../Adapters/DB/stories_db")
const { buildAddStory } = require("./add_story")
const { buildDeleteStoryById } = require("./delete_story_by_id")
const { buildGetStoryByid } = require("./get_story_by_id")
const { Id } = require("../../CustomHelpers/Id_helper")
const { AppError } = require("../../app_error")

const addStory = buildAddStory({ storiesDb })
const deleteStoryById = buildDeleteStoryById({ storiesDb, Id, AppError })
const getStoryById = buildGetStoryByid({ storiesDb, Id, AppError })

module.exports = { addStory, deleteStoryById, getStoryById }