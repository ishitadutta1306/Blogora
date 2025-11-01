import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, changePassword, forgotPassword, resetPassword, toggleFollowUser, fetchFollowers, fetchFollowing, fetchPostCount, deleteAccount, searchUsers } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

//create a router object
const router=express.Router();

//public routes:
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile/:id",getUserProfile);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);
router.get("/search",searchUsers);

//protected routes:
router.put("/update",protect,updateUserProfile);
router.put("/change-password",protect,changePassword);
router.put("/follow/:id",protect,toggleFollowUser);
router.get("/followers/:id?",protect,fetchFollowers);
router.get("/following/:id?",protect,fetchFollowing);
router.get("/posts-count/:id?",protect,fetchPostCount);
router.delete("/delete",protect,deleteAccount);

export default router;
