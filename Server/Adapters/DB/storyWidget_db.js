const { default: mongoose } = require("mongoose")
const { AppErrorMessages, AppError } = require("../../app_error")
const { storyWidgetModel } = require("./schemes/story_widget_scheme")


class StoryWidgetsDB {
    static async insert(widget) {
        // Insert story widget
        const widgetObject = new storyWidgetModel({
            _id: widget.id,

            name: widget.name,
            description: widget.description,

            createdAt: widget.createdAt
        })
        await widgetObject.save()
    }

    static async findById(widgetId) {
        // returns widget by id

        const widget = await storyWidgetModel.findById(widgetId)

        if (widget == null) {
            throw new AppError(AppErrorMessages.widgetDoesNotExist)
        }

        return widgetObjectFromDbObject(story)
    }

    static async deleteById(widgetId) {
        // Deletes widget by id

        await storyWidgetModel.findByIdAndDelete(widgetId)
    }

    static async doesWidgetExist(widgetId) {
        // returns if story exists

        const widget = await storyWidgetModel.findById(widgetId)
        return widget == null
    }
}


function widgetObjectFromDbObject(dbObject) {
    // Returns widget object from db widget object

    return Object.freeze({
        id: dbObject._id.toString(),

        name: dbObject.name,
        description: dbObject.description,

        createdAt: dbObject.createdAt
    })
}

module.exports = { StoryWidgetsDB }