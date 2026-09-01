const messageModel = require('../models/chat.model')

const chatUser = async (req, res) => {
    try {
        const loggedinId = req.user;
        const { messageUser } = req.body;

        if (!messageUser) {
            return res.status(401).json({
                message: "No user found"
            })
        }

        const existingUser = await messageModel.conversationModel.findOne({
            participants: { $all: [loggedinId, messageUser] }
        })

        let user;

        if (existingUser) {
            return res.status(200).json({
                user: existingUser,
                message: "conversation Open successfully"
            })
        }

        const conversationUser = await messageModel.conversationModel.create({
            participants: [
                loggedinId,
                messageUser
            ]
        })

        return res.status(201).json({
            message: "conversation open successfully",
            user: conversationUser
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "server error"
        })
    }
}

const chatesUser = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const loggedin = req.user;

        const chat = await messageModel.conversationModel.findById(conversationId).populate("participants")
        if (!chat) {
            return res.status(401).json({
                message: "chat not found"
            })
        }
        const otherPerson = chat.participants.find((elem) => {
            return elem._id.toString() != loggedin.toString()
        })

        return res.status(200).json({
            message: "your chat get successful",
            otherPerson
        })
    } catch (error) {
        console.error(error)
        return res.status(401).json({
            message: "server error"
        })
    }

}

const message = async (req, res) => {
    try {
        const { conversationId, text } = req.body;

        const loggedinId = req.user;

        await messageModel.chatModel.create({
            conversationId,
            sender: loggedinId,
            text
        })

        return res.status(201).json({
            message:"message send successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message:"server error"
        })
    }
}

const messages = async (req, res) =>{
    try {
        const {conversationId} = req.params;

        const userMessage = await messageModel.chatModel.find({conversationId})

        return res.status(200).json({
            message: "messages get successful",
            userMessage
        })
    
    } catch (error) {
        console.error(error)
        return res.status(401).json({
            message:"server error"
        })
    }
}

module.exports = { chatUser, chatesUser, message, messages }