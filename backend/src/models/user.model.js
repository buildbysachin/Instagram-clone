const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
        sparse: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    fullName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "custom", "prefer_not_to_say"],
        default: "prefer_not_to_say"
    },
    profilePic: {
        type: String,
        default: "https://ik.imagekit.io/ls5mxwckb/wanderercreative-blank-profile-picture-973460.svg"
    },
    bio: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
},
    {
        timestamps: true
    }
)

userSchema.pre("validate", function () {
    if (!this.email && !this.phone) {
        this.invalidate("email", "Either email or phone number is required")
    }
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel;