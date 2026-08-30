const express = require('express')
const postController = require('../controllers/post.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const multer = require('multer')

const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/upload',upload.single('file'), authMiddleware.authUser, postController.userPost)

router.get('/posts',authMiddleware.authUser, postController.getUserPost)

router.get('/userPost/:userId',authMiddleware.authUser, postController.getPost )

router.patch('/like/:postId',authMiddleware.authUser, postController.getLikes)

module.exports = router