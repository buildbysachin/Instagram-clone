const express = require('express')
const chatController = require('../controllers/chat.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

router.post('/chats',authMiddleware.authUser, chatController.chatUser)

router.get('/chats/:conversationId',authMiddleware.authUser, chatController.chatesUser)

router.post('/message', authMiddleware.authUser, chatController.message)

router.get('/messages/:conversationId', authMiddleware.authUser, chatController.messages )

module.exports = router;