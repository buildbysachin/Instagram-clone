const express = require('express')
const authController = require('../controllers/auth.controller')
const multer = require('multer')
const validationRules = require('../middlewares/validation.middleware')
const authMiddleware = require('../middlewares/auth.middleware')

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router()

router.post('/signin', upload.single("profilePic"),validationRules.registerUserValidationResult, authController.registerUser)

router.post('/login', authController.loginUser)

router.post('/logout', authController.logoutUser)

router.post('/username', authController.chackUsername)

router.get('/profile/:username',authMiddleware.authUser ,authController.profileUser)

router.get('/explore/:username',authMiddleware.authUser , authController.searchUser)

router.get('/decode/:username',authMiddleware.authUser, authController.triedUser)

router.post('/follow',authMiddleware.authUser, authController.followUser )

router.get('/chackFollow/:username',authMiddleware.authUser, authController.chackFollowUser)

router.get('/chackUserFollowList/:username',authMiddleware.authUser, authController.chackUserFollowList)

router.get('/me',authMiddleware.authUser , authController.getMyUser)

router.patch('/userEdit',upload.single("file"), authMiddleware.authUser, validationRules.updateuserValidationResult, authController.userdit)

module.exports = router;