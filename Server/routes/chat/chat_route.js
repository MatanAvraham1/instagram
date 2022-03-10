const { authenticateToken } = require('../auth');
const { doesHasPermission } = require('../../helpers/privacyHelper');
const chatRouter = express.Router({ mergeParams: true })

// Gets chat of user
chatRouter.get('/:chatId', authenticateToken, doesHasPermission, async (req, res) => {
    try {

        const chat = await getChatById(req.params.chatId)
        const addressee = await getUserById(chat.addressee)

        return res.status(200).json({
            addressee: {
                username: addressee.username,
                fullname: addressee.fullname,
                bio: addressee.bio,
                photoUrl: addressee.photoUrl,
                isPrivate: addressee.isPrivate,
                followers: addressee.followers.length,
                followings: addressee.followings.length,
                posts: addressee.posts.length,
                stories: (await getLast24HoursStories(addressee._id)).length,
                isFollowMe: addressee.followings.includes(req.userId),
                isFollowedByMe: addressee.followers.includes(req.userId),
                isRequestedByMe: addressee.followRequests.includes(req.userId),
                id: addressee._id
            },
            lastMessage: chat.messages[-1],
            id: chat._id,
        })
    }
    catch (err) {
        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(404)
        }
        if (err === chatErrors.chatNotExistsError) {
            return res.sendStatus(404)
        }

        console.log(err)
        res.sendStatus(500)
    }
})


// Gets messages of chat
chatRouter.get('/messages', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        const startFromMessageIndex = req.query.startFrom
        const endOnMessageIndex = startFromMessageIndex + 15
        if (startFromCommentIndex === undefined) {
            return res.sendStatus(400)
        }

        const response = []
        const messages = await getMessages(req.params.userId, req.params.chatId)

        for (const message of messages.slice(startFromMessageIndex, endOnMessageIndex > messages.length ? messages.length : endOnMessageIndex)) {

            const _message =
            {
                sentBy: _message.sentBy,
                sentAt: _message.sentAt,
                likes: _message.likes.length,
                isLikedByMe: likes.includes(req.userId),
                id: _message._id,
            }

            response.push(_message)
        }

        return res.status(200).json(response)
    }
    catch (err) {
        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(404)
        }
        if (err === chatErrors.chatNotExistsError) {
            return res.sendStatus(404)
        }
        if (err === chatErrors.messageNotExistsError) {
            return res.sendStatus(404)
        }

        console.log(err)
        res.sendStatus(500)
    }
})


module.exports = { chatRouter }