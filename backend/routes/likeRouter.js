import express from "express";
import { toggleLikePost, toggleLikeComment } from "../controllers/likeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router();

//only protected routes:
router.post("/post/:postId",protect,toggleLikePost);
router.post("/comment/:commentId",protect,toggleLikeComment);

export default router;
