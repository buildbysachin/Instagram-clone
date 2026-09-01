const express = require('express')
const chatController = require('../controllers/chat.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

router.post('/chats',authMiddleware.authUser, chatController.chatUser)

router.get('/chats/:conversationId',authMiddleware.authUser, chatController.chatesUser)

module.exports = router;