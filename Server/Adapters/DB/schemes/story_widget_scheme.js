const mongoose = require('mongoose')

const storyWidgetModel = mongoose.model("StoryWidget", mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        required: true
    }
}))

module.exports = { storyWidgetModel }