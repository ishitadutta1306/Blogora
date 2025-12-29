import express from "express";
import { createPost, getAllPosts, getPostBySlug, updatePost, deletePost, toggleBookmark } from '../controllers/postController.js';
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router=express.Router();

//public routes:
router.get("/",getAllPosts);
router.get("/:slug",getPostBySlug);

//protected routes:
router.post("/",protect,upload.single("coverImage"), createPost);
router.put("/:id", protect, upload.single("coverImage"), updatePost);
router.delete("/:id",protect,deletePost);
router.put("/:id/bookmark",protect,toggleBookmark);

export default router;
