const mongoose = require("mongoose")
const Joi = require('joi')
const { userModel, doesUserExists } = require("./user_model")
const { messageModel } = require("./message_model")
const appErrors = require("../appErrors")

const chatModel = mongoose.model("Chat", mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true,
    },
    members: {
        type: Array,
        required: true,
    },


    membersCount: {
        type: Number,
        default: 0,
    },
    messagesCount: {
        type: Number,
        defualt: 0,
    }
}))


function isChatValidate(data) {
    const scheme = Joi.object({
        createdAt: Joi.date().default(Date.now),
        createdBy: Joi.string().required(),
        members: Joi.array().min(2).required(),
        membersCount: Joi.number().equal([data.members.length]),
        messagesCount: Joi.number().default(0), // TODO: check that
    })

    const value = scheme.validate(data)

    if (value.error === undefined) {
        return true
    }

    return false
}


async function isChatExists(chatId) {
    /*
    Returns if chat exists
    */

    return (await chatModel.findById(chatId)) === null
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
        throw appErrors.invalidChat
    }
}


async function deleteChat(chatId) {
    /*
    Deletes chat

    param 1: the chat id
    */

    try {
        await chatModel.findByIdAndDelete(chatId)
    }
    catch (err) {
        throw appErrors.chatNotExist
    }

    await messageModel.deleteMany({ id: mongoose.Types.ObjectId(chatId) })
}

async function getChatById(chatId) {
    /*
    Returns chat by id

    param 1: chat id
    */

    const chat = await chatModel.findById(chatId)
    if (chat === null) {
        throw appErrors.chatNotExist
    }
    return chat

}


async function isMember(chatId, userId) {
    /*
    Returns if [userId] is member of [chatId]
    */


    if (!(await isChatExists(chatId))) {
        throw appErrors.chatNotExist
    }

    if (await chatModel.findOne({ id: mongoose.Types.ObjectId(chatId), members: { $in: [userId] } }) === null) {
        return false
    }

    return true
}

async function addMember(chatId, userId) {
    /*
    Adds member to chat

    param 1: the id of the chat
    param 2: the id of the user to add
    */

    if (!(await isChatExists(chatId))) {
        throw appErrors.chatNotExist
    }

    if (await isMember(chatId, userId)) {
        throw appErrors.memberAlreadyInChat
    }

    await chatModel.findByIdAndUpdate(chatId, { $addToSet: { members: userId }, $inc: { membersCount: 1 } })
}


async function removeMember(chatId, userId) {
    /*
    Removes member from chat

    param 1: the id of the chat
    param 2: the id of the user to remove
    */

    if (!(await isChatExists(chatId))) {
        throw appErrors.chatNotExist
    }

    if (!(await isMember(chatId, userId))) {
        throw appErrors.memberNotInChat
    }

    await chatModel.findByIdAndUpdate(chatId, { $pull: { members: userId }, $inc: { membersCount: -1 } })
}


module.exports = { chatModel, appErrors, createChat, deleteChat, getChatById, addMember, removeMember }