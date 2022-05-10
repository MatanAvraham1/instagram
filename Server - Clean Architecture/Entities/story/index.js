const { Id } = require("../../CustomHelpers/Id_helper")
const { StoryStructure } = require("../../CustomHelpers/Story_Structure")
const { buildMakeStory } = require("./story_entity")
const { AppError } = require('../../app_error')

const makeStory = buildMakeStory({ Id, StoryStructure, AppError })

module.exports = { makeStory }