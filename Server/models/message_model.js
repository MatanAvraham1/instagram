const mongoose = require("mongoose")
const Joi = require('joi')
const { getChatById, chatErrors, updateChat } = require("./chat_model")
const appErrors = require("../appErrors")


const messageModel = mongoose.model("Message", mongoose.Schema({
    sentBy: {
        type: String,
        required: true,
    },
    sentAt: {
        type: Date,
        default: Date.now,
    },
    message: {
        type: String,
        required: true,
    },
    likes: {
        type: String,
        default: [],
    },

    likesCount: {
        type: Number,
        default: 0,
    }
}))


function isMessageValidate(data) {
    const scheme = Joi.object({
        sentBy: Joi.string().required(),
        sentAt: Joi.date().default(Date.now),
        message: Joi.string().required(),
        likes: Joi.array().default([]),
        likesCount: Joi.defaults(0), // TODO: check that
    })

    const value = scheme.validate(data)

    if (value.error === undefined) {
        return true
    }

    return false
}
async function getMessages(chatId, startMessageIndex, quantity) {
    /*
    Returns messages of chat

    param 1: the id of the chat
    param 2: from which message to start
    param 3: how much messages to return
    */

    if (!(await isChatExists(chatId))) {
        throw chatErrors.chatNotExist
    }

    return await messageModel.find({ chatId: chatId }).skip(startMessageIndex).limit(quantity)
}


async function addMessage(chatId, message) {
    /*
    Adds message to chat

    param 1: chat id
    param 2: the message object

    return: message id
    */

    if (isMessageValidate(message)) {
        const message = messageModel(message)
        const { _id } = await message.save()

        return _id;
    }
    else {
        throw appErrors.invalidMessage
    }
}

async function getMessage(messageId) {

    const message = await messageModel.findById(messageId)
    if (message === null) {
        throw appErrors.messageNotExist
    }

    return message
}

async function isMessageExist(messageId) {
    try {
        getMessage(messageId)
        return true
    }
    catch (err) {
        if (err == appErrors.messageNotExist) {
            return false
        }
    }
}

async function deleteMessage(messageId) {
    /*
    Deletes message from chat

    param 1: the chat id of the chat which include the message
    param 2: the id of the message
    */

    try {
        await messageModel.findByIdAndDelete(messageId)
    }
    catch (err) {
        throw appErrors.messageNotExist
    }

}

async function isMessageLiked(messageId, likedById) {

    const message = await messageModel.findOne({ id: mongoose.Types.ObjectId(messageId), likes: { $in: [likedById] } })
    if (message === null) {
        return false
    }

    return true
}

async function likeMessage(messageId, likedById) {
    /*
    Likes messsage

    param 1: the id of the message
    param 2: the id of the liker
    */

    if (!(await isMessageExist(messageId))) {
        throw appErrors.messageNotExist
    }

    if (await isMessageLiked(messageId, likedById)) {
        throw appErrors.alreadyLikedError
    }

    await messageModel.findByIdAndUpdate(messageId, { $addToSet: { likes: likedById }, $inc: { likesCount: 1 } })
}

async function unlikeMessage(messageId, likedById) {
    /*
    Unlikes messsage

    param 1: the id of the message
    param 2: the id of the liker
    */

    if (!(await isMessageExist(messageId))) {
        throw appErrors.messageNotExist
    }

    if (!(await isMessageLiked(messageId, likedById))) {
        throw appErrors.alreadyUnlikedError
    }

    await messageModel.findByIdAndUpdate(messageId, { $pull: { likes: likedById }, $inc: { likesCount: -1 } })
}



module.exports = { messageModel, isMessageValidate, getMessages, addMessage, getMessage, isMessageExist, deleteMessage, isMessageLiked, likeMessage, unlikeMessage }