const mongoose = require("mongoose")
const Joi = require('joi')
const { getChatById, chatErrors, updateChat } = require("./chat_model")

const messageErrors = {
    messageNotExist: "message doesn't exist!",
    invalidMessage: "invalid message!",
    alreadyLikedError: "the message is already liked!",
    alreadyUnlikedError: "the message is already unliked!"
}


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
    }
}))


function isMessageValidate(data) {
    const scheme = Joi.object({
        sentBy: Joi.string().required(),
        sentAt: Joi.date().default(Date.now),
        message: Joi.string().required(),
        likes: Joi.array().default([])
    })

    const value = scheme.validate(data)

    if (value.error === undefined) {
        return true
    }

    return false
}


async function addMessage(chatId, message) {
    /*
    Adds message to chat

    param 1: chat id
    param 2: the message object

    return: message id
    */

    try {
        if (isMessageValidate(message)) {
            const message = messageModel(message)
            const chat = getChatById(chatId);
            chat.messages.push(message)
            await updateChat(chatId, chat)

            return message.id;
        }
        else {
            throw messageErrors.invalidMessage
        }
    }
    catch (err) {
        if (err == chatErrors.chatNotExist) {
            throw chatErrors.chatNotExist
        }

        throw err
    }
}


async function deleteMessage(chatId, messageId) {
    /*
    Deletes message from chat

    param 1: the chat id of the chat which include the message
    param 2: the id of the message
    */

    try {
        const chat = await getChatById(chatId)
        const messageIndex = chat.messages.findIndex((message) => message._id.toString() === messageId.toString())
        if (messageIndex === -1) {
            throw messageErrors.messageNotExist
        }

        chat.messages.splice(messageIndex, 1)
        await updateChat(chatId, chat)
    }
    catch (err) {
        if (err == chatErrors.chatNotExist) {
            throw chatErrors.chatNotExist
        }

        throw err
    }
}

async function likeMessage(chatId, messageId, likedById) {
    /*
    Likes messsage

    param 1: the id of the chat which include the message 
    param 2: the id of the message
    param 3: the id of the liker
    */

    try {
        const chat = await getChatById(chatId)
        const messageIndex = chat.messages.findIndex((message) => message._id.toString() === messageId.toString())
        if (messageIndex === -1) {
            throw messageErrors.messageNotExist
        }

        if (chat.messages[messageIndex].likes.includes(likedById)) {
            throw messageErrors.alreadyLikedError
        }
        chat.messages[messageIndex].likes.push(likedById)
        await updateChat(chatId, chat)
    }
    catch (err) {
        if (err == chatErrors.chatNotExist) {
            throw chatErrors.chatNotExist
        }

        throw err
    }
}

async function unlikeMessage(chatId, messageId, likedById) {
    /*
    Unlikes messsage

    param 1: the id of the chat which include the message 
    param 2: the id of the message
    param 3: the id of the unliker
    */

    try {
        const chat = await getChatById(chatId)
        const messageIndex = chat.messages.findIndex((message) => message._id.toString() === messageId.toString())
        if (messageIndex === -1) {
            throw messageErrors.messageNotExist
        }

        const likeIndex = chat.messages[messageIndex].likes.findIndex((like) => like === likedById)
        if (likeIndex === -1) {
            throw messageErrors.alreadyUnlikedError
        }

        chat.messages[messageIndex].likes.splice(likeIndex, 1)
        await updateChat(chatId, chat)
    }
    catch (err) {
        if (err == chatErrors.chatNotExist) {
            throw chatErrors.chatNotExist
        }

        throw err
    }

}