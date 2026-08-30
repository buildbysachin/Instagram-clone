const { default: mongoose } = require("mongoose");
const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const { find } = require("../models/user.model");
const { postFile } = require("../services/storage.service");
const jwt = require('jsonwebtoken');

async function userPost(req, res) {
    const { caption, postType } = req.body;
    const file = req.file;
    const result = await postFile(file.buffer.toString('base64'))
    console.log(result);

    postModel.create({
        author: req.user.id,
        caption,
        postType,
        media: [
            {
                url: result.url,
                fieldId: result.fileId,
                mediaType: req.file.mimetype.startsWith("video") ? "video" : "image",
                thumbnailUrl: result.thumbnailUrl
            }
        ]
    })

    res.status(201).json({
        message: "post created successfully"
    })
}

async function getUserPost(req, res) {
    try {
        const token = req.cookies?.token;
        let mainFollowingSet = new Set();
        let loggedId = null;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            loggedId = decoded.id

            const user = await userModel.findById(loggedId).select("following")
            if (user?.following) {
                mainFollowingSet = new Set(user.following.map(id => id.toString()))
            }
        } catch (error) {
            console.error(error)
        }

        const post = await postModel.find().populate("author").populate("media")

        const postWithStatus = post.map((postDoc) => {
            const postObj = postDoc.toObject ? postDoc.toObject() : postDoc
            const authorId = postObj.author?._id?.toString();

            return {
                ...postObj,
                author: {
                    ...postObj.author,
                    isFollowing: mainFollowingSet.has(authorId),
                    isOwner: authorId === loggedId
                }
            }
        })
        console.log(postWithStatus[0].like);
        console.log(loggedId);

        res.status(200).json({
            message: "post fetched successfully",
            post: postWithStatus
        })
    } catch (error) {
        console.error("server error", error)
        return res.status(500).json({ message: "Server error" });
    }
}

async function getPost(req, res) {

    try {
        const { userId } = req.params;
        const post = await postModel.find({ author: userId }).populate("author").populate("media")

        return res.status(200).json({
            message: "post fatched successfully",
            post
        })
    } catch (error) {
        res.status(404).json({
            message: "server error"
        })
    }
}

async function getLikes(req, res) {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { postId } = req.params;
        const likeUserId = req.user;

        const post = await postModel.findById(postId)

        if (!post) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({
                message: "post not found"
            })
        }

        const isLike = post.like?.some(
            elem => elem.toString() === likeUserId.toString()
        )

        let updatedPost;

        if (isLike) {
            updatedPost = await postModel.findByIdAndUpdate(
                postId,
                { $pull: { like: likeUserId } },
                { new: true, session }
            )
        } else {
            updatedPost = await postModel.findByIdAndUpdate(
                postId,
                { $addToSet: { like: likeUserId } },
                { new: true, session }
            )
        }
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            isLiked: !isLike,
            totalLikes: updatedPost.like.length,
            message: isLike ? "post unliked" : "post liked"
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
            success: false,
            message: "server error"
        })
    }

}

module.exports = { userPost, getUserPost, getPost, getLikes }