const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },
    caption: {
        type: String,
        trim: true,
        default: true
    },
    postType: {
        type: String,
        enum: ["image", "video", "reel", "carousel"],
        required: true,
    },
    media: [
        {
            url: {
                type: String,
                required: true
            },
            fieldId: {
                type: String
            },
            mediaType: {
                type: String,
                enum: ["image", "video"],
                required: true
            },
            thumbnailUrl: {
                type: String
            }
        }
    ],
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    comment: [
    {
        cmtUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        commented: {
            type: String,
            trim: true,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
]
},
    {
        timestamps: true,
    }
)

const postModel = mongoose.model('post', postSchema)

module.exports = postModel;