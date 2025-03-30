const express = require("express");
const {UserSignUp , loginuser, getUserProfile, logout, updateUserProfile , checkUser , logoutUser} = require("../controller/userController");
const { isAuthicated } = require("../middleware/isAuthicated");

const router = express.Router();

router.post("/register", UserSignUp);
router.post('/login' , loginuser);
router.get('/logout' , logout)
router.get('/profile' , isAuthicated , getUserProfile)
router.put('/profileUpdate' ,isAuthicated ,updateUserProfile);
router.get('/' ,isAuthicated ,checkUser);
router.post('/logout' ,isAuthicated ,logoutUser);
module.exports = router; // Fix missing export
