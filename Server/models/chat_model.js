const mongoose = require("mongoose")
const Joi = require('joi')

const chatErrors = {
    chatNotExist: "chat doesn't exist!",
    invalidChat: "invalid chat!",
    memberNotInChat: "the members not in this chat!"
}


const chatModel = mongoose.model("Chat", mongoose.Schema({
    messages: {
        type: Array,
        default: [],
    },
    members: {
        type: Array,
        required: true,
    }
}))


function isChatValidate(data) {
    const scheme = Joi.object({
        messages: Joi.array().default([]),
        members: Joi.array().min(2).required(),
    })

    const value = scheme.validate(data)

    if (value.error === undefined) {
        return true
    }

    return false
}


async function createChat(data) {
    /*
    Creates chat

    return: created chat id
    */
    if (isChatValidate(data)) {
        const chat = chatModel({ members: data.members });
        const { _id } = await chat.save()
        return _id;
    }
    else {
        throw chatErrors.invalidChat
    }
}


async function deleteChat(chatId) {
    /*
    Deletes chat

    param 1: the chat id
    */

    try {
        await chatModel.deleteOne({ _id: chatId })
    }
    catch (err) {
        throw chatErrors.chatNotExist
    }
}

async function getChatById(chatId) {
    /*
    Returns chat by id

    param 1: chat id
    */

    try {
        const chat = await chatModel.findById(chatId)
        if (chat === null) {
            throw chatErrors.chatNotExist
        }
        return chat
    }
    catch (err) {
        throw chatErrors.chatNotExist
    }
}

async function updateChat(chatId, chat) {
    /*
    Updates chat object in the db

    param 1: the id of the chat
    param 2: the updated chat object
    */

    try {
        await chatModel.updateOne({ _id: chatId }, chat)
    }
    catch (err) {
        throw chatErrors.chatNotExist
    }
}


async function addMember(chatId, userId) {
    /*
    Adds member to chat

    param 1: the id of the chat
    param 2: the id of the user to add
    */

    try {
        const chat = getChatById(chatId)
        chat.members.push(userId)
        updateChat(chatId, chat)
    }
    catch (err) {
        if (err == chatErrors.chatNotExist) {
            throw chatErrors.chatNotExist
        }
    }
}


async function removeMember(chatId, userId) {
    /*
    Removes member from chat

    param 1: the id of the chat
    param 2: the id of the user to remove
    */

    try {
        const chat = getChatById(chatId)
        const memberIndex = chat.members.findIndex((memberId) => memberId === userId)
        if (memberIndex === -1) {
            throw chatErrors.memberNotInChat
        }
        chat.members.splice(memberIndex, 1)

        updateChat(chatId, chat)
    }
    catch (err) {
        if (err == chatErrors.chatNotExist) {
            throw chatErrors.chatNotExist
        }
    }
}

async function getMessages(chatId) {
    /*
    Returns messages of chat

    param 1: the chat id
    */

    try {
        const chat = await getChatById(chatId)
        return chat.messages
    }
    catch (err) {
        if (err == chatErrors.chatNotExist) {
            throw chatErrors.chatNotExist
        }

        throw err
    }
}

async function getChats(userId) {
    /*
    Returns chats of user

    param 1: the id of the user
    */

    const chats = chatModel.find({ followers: { $in: ["61eab7d64e802bbae505f38e"] } })
    return chats
}

module.exports = { chatModel, chatErrors, createChat, deleteChat, getChatById, updateChat, getMessages, addMember, removeMember }