const { Id } = require("../../CustomHelpers/Id_helper")
const { PhotosChecker } = require("../../CustomHelpers/Photos_checker")
const { StoryWidgetChecker } = require("../../CustomHelpers/Story_widget_checker")
const { buildMakeStory } = require("./story_entity")
const { AppError, AppErrorMessages } = require('../../app_error')
const { UsersDB } = require("../../Adapters/DB/users_db")

const makeStory = buildMakeStory({ Id, PhotosChecker, StoryWidgetChecker, AppError, AppErrorMessages, UsersDB })

module.exports = { makeStory }