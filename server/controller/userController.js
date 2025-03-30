const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/genrateToken");
const { deleteMedia, uploadMedia } = require("../utils/cloundinary");

async function UserSignUp(req, res) {
    let { userName, email, password } = req.body;

    try {
        // 🔹 Validate required fields
       

        // 🔹 Normalize email (trim + lowercase)
       

        // 🔹 Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "The user already exists",
            });
        }

        // 🔹 Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Create the new user
        const newUser = await prisma.user.create({
            data: {
                userName: userName,
                email,
                password: hashedPassword,
            }
        });

        // 🔹 Generate token and set cookie
        const accessToken = generateToken(res, newUser, `Welcome back ${newUser.userName || "User"}`);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                accessToken,
                newUser
            },
        });

    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to sign up the user",
        });
    }
}

const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const checkUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        // Generate token and set cookie
        const accessToken = generateToken(res, checkUser, `Welcome back ${checkUser.userName}`);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                accessToken,
                user: {
                    _id: checkUser.id,
                    userName: checkUser.userName,
                    email: checkUser.email,
                    role: checkUser.role,
                },
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//for logout contorller
const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logout Succefully",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Logout"
        })
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.id; // Ensure correct extraction of user ID

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                userName: true,
                email: true,
                role: true,
                createdAt: true,
                photoUrl: true,
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        console.log(user);
        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: user,
        });

    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user profile",
        });
    }
};


const updateUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { userName } = req.body;
        const photoUrl = req.file;

        const user = await prisma.findUnique({
            where: {
                userId: userId
            }
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false

            })
        }
        //extract the public id od the old image form the is its exists
        if (user.photoUrl) {
            const publicId = user.photoUrl.split("/").pop().split(".")[0];
            deleteMedia(publicId);
        }

        //upload new photo
        const cloudResponse = await uploadMedia(photoUrl.path);
        const image = cloudResponse.secure_url;

        const updateData = { userName, image };
        const updateUser = await prisma.user.update({
            wherer: {
                userId: userId
            },
            data: updateData,
        })
        return res.status(200).json({
            message: "updatedSuccefully",
            success: true,
            updateUser

        })
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update the User",
        });
    }
}

//check user
const checkUser = async (req, res) => {
    try {
        const checkUsers = req.id;

        const user = await prisma.user.findUnique({
            where: { id: checkUsers },
            select: {
                userName: true,  // Include specific fields
                email: true,
                password: false,
                role:true  // This does not work in Prisma, needs to be removed
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User found",
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to check the User",
        });
    }
};


const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" }); // Removes token
        return res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
};


module.exports = { UserSignUp, loginuser, logout, getUserProfile, updateUserProfile , checkUser  , logoutUser};
