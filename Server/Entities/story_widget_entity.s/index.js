const { Id } = require("../../CustomHelpers/Id_helper")
const { AppError, AppErrorMessages } = require('../../app_error')
const { TextChecker } = require("../../CustomHelpers/Text_checker")
const { buildMakeStoryWidget } = require("./story_widget_entity")

const makeStoryWidget = buildMakeStoryWidget({ Id, AppError, AppErrorMessages, TextChecker })

module.exports = { makeStoryWidget }