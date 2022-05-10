const { Id } = require("../../CustomHelpers/Id_helper")
const { StoryStructure } = require("../../CustomHelpers/Story_Structure")
const { buildMakeStory } = require("./story_entity")
const { AppError } = require('../../app_error')
const { UsersDB } = require("../../Adapters/DB/users_db")

const makeStory = buildMakeStory({ Id, StoryStructure, AppError, UsersDB })

module.exports = { makeStory }