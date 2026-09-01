const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    lastMessage: {
        type: String
    }
}, {timestamps: true})

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversation'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, {timestamps: true})

const conversationModel = mongoose.model('conversation', conversationSchema)
const chatModel = mongoose.model('chat', messageSchema)

module.exports = {conversationModel, chatModel}