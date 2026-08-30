const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs');
const { uploadFile } = require("../services/storage.service");
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");

async function registerUser(req, res) {
    try {
        const {
            username,
            email,
            phone,
            password,
            fullName,
            gender,
            bio,
            role
        } = req.body;
        const file = req.file;

        const isAlreadyExists = await userModel.findOne({
            $or: [
                { username }
            ]
        })

        if (isAlreadyExists) {
            return res.status(401).json({
                message: "this user is already exist"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        let profilePic;

        if (file) {
            const result = await uploadFile(file.buffer.toString('base64'))
            profilePic = result.url
        }

        const user = await userModel.create({
            username,
            email,
            phone,
            password: hash,
            fullName,
            gender,
            profilePic,
            bio,
            role
        })

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET)

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax"
        })

        res.status(201).json({
            message: "user created successfully",
            token
        })

    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Unauthrize"
        })
    }
}

async function loginUser(req, res) {
    const { identifier, username, email, phone, password } = req.body;
    const loginId = identifier || username || email || phone;

    if (!loginId || !password) {
        return res.status(400).json({
            message: "username, email or phone and password are required"
        })
    }

    const user = await userModel.findOne({
        $or: [
            { username: loginId },
            { email: loginId },
            { phone: loginId }
        ]

    }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "not found any account create to enter"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "invalid email and password"
        })
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: "lax"
    })

    res.status(200).json({
        message: "user Loggin successfully",
        token
    })
}

async function logoutUser(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    })
    res.status(200).json({
        message: "logout successfully"
    })
}

async function chackUsername(req, res) {

    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "username is required" })
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ message: "username must be under or equal 3 to 20 character" })
        }

        if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
            return res.status(400).json({ message: "Only letters, numbers, _, and . allowed" });
        }

        const existingUser = await userModel.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "username is unavailable" })
        }

        return res.status(200).json({ message: "" })
    } catch (error) {
        return res.status(400).json({ message: "server error" })

    }
}

async function profileUser(req, res) {
    try {
        const { username } = req.params;

        const user = await userModel.find({ username: username.toLowerCase().trim() }).select("-password").populate("following").populate("followers")

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        return res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function searchUser(req, res) {
    try {
        const { username } = req.params;

        if (!username || username.trim() === "") {
            return res.json({
                user: []
            })
        }

        const user = await userModel.find({
            username: { $regex: username, $options: 'i' }
        })

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }

        res.status(200).json({
            message: "username fatched successfully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function triedUser(req, res) {
    try {
        const { username } = req.params;

        const targetUser = await userModel.findOne({ username }).select("-password")

        let isOwner = false;
        const token = req.cookies?.token;
        let profileUserId;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)

                profileUserId = decoded.id;
                if (decoded.id === targetUser._id.toString()) {
                    isOwner = true;
                }
            } catch (error) {
                isOwner = false;
            }
        }

        return res.status(200).json({
            message: "Owner chack successfully",
            isOwner: isOwner,
            profileUserId
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }

}

async function followUser(req, res) {
    const session = await mongoose.startSession();

    try {
        const { username } = req.body;

        const requestUser = await userModel.findOne({ username });

        if (!requestUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userId = requestUser._id;

        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const mainUser = decoded.id;

        if (mainUser === userId) {
            return;
        }

        const userFollow = await userModel
            .findById(mainUser)
            .select("following");

        const isFollowing = userFollow.following?.some(
            elem => elem.toString() === userId.toString()
        );

        session.startTransaction();

        if (isFollowing) {

            await userModel.findByIdAndUpdate(
                mainUser,
                {
                    $pull: {
                        following: userId
                    }
                },
                { session }
            );

            await userModel.findByIdAndUpdate(
                userId,
                {
                    $pull: {
                        followers: mainUser
                    }
                },
                { session }
            );

            await session.commitTransaction();

            return res.status(200).json({
                message: "User unfollowed successfully",
            });

        } else {

            await userModel.findByIdAndUpdate(
                mainUser,
                {
                    $addToSet: {
                        following: userId
                    }
                },
                { session }
            );

            await userModel.findByIdAndUpdate(
                userId,
                {
                    $addToSet: {
                        followers: mainUser
                    }
                },
                { session }
            );

            await session.commitTransaction();

            return res.status(200).json({
                message: "User followed successfully",
            });
        }

    } catch (error) {

        await session.abortTransaction();
        throw error;

    } finally {

        session.endSession();
    }
}

async function chackFollowUser(req, res) {
    try {
        const { username } = req.params;

        const requestUser = await userModel.findOne({ username });

        if (!requestUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userId = requestUser._id;

        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const mainUser = decoded.id;

        const userFollow = await userModel
            .findById(mainUser)
            .select("following");

        const isFollowing = userFollow.following?.some(
            elem => elem.toString() === userId.toString()
        );

        res.status(200).json({
            isFollowing
        })
    } catch (error) {
        res.status(400).json({
            message: "server error"
        })
    }
}

async function chackUserFollowList(req, res) {
    try {
        const { username } = req.params;

        const searchUser = await userModel
            .findOne({ username })
            .populate("following")
            .populate("followers")

        if (!searchUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const mainUserId = decoded.id

        const mainUser = await userModel.findById(mainUserId).populate("following")

        let isFollowing;

        // 1. mainUser ki following IDs ka ek Set banayein (O(1) fast lookup ke liye)
        const mainFollowingSet = new Set(
            mainUser.following.map((u) => (u._id ? u._id.toString() : u.toString()))
        );

        // 2. searchUser ke followers ke har user ko match karayein
        const followersWithStatus = searchUser.followers.map((userDoc) => {
            const userObj = userDoc.toObject ? userDoc.toObject() : userDoc;
            return {
                ...userObj,
                isFollowing: mainFollowingSet.has(userObj._id.toString())
            };
        });

        // 3. searchUser ke following ke har user ko match karayein
        const followingWithStatus = searchUser.following.map((userDoc) => {
            const userObj = userDoc.toObject ? userDoc.toObject() : userDoc;
            return {
                ...userObj,
                isFollowing: mainFollowingSet.has(userObj._id.toString())
            };
        });

        res.status(200).json({
            followers: followersWithStatus,
            following: followingWithStatus
        })
    } catch (error) {
        console.error(error)
        return res.status(400).json({
            message: "server error"
        })
    }
}

async function getMyUser(req, res) {
    const token = req.cookies?.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const loggedInUserId = decoded.id

    const user = await userModel.findById(loggedInUserId)

    res.status(200).json({
        loggedInUserId,
        user
    })
}

async function userdit(req, res) {
    try {
        const { username, bio, fullName, gender } = req.body;
        const userId = req.user;
        const file = req.file;

        let profilePic;
        if (file) {
            const result = await uploadFile(file.buffer.toString('base64'))
            profilePic = result.url
        }

        const user = await userModel.findByIdAndUpdate(userId, {
            username,
            bio,
            fullName,
            profilePic,
            gender
        })

        res.status(200).json({
            username
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    registerUser, loginUser, logoutUser,
    chackUsername, profileUser, searchUser,
    triedUser, followUser, chackFollowUser,
    chackUserFollowList, getMyUser, userdit
}
