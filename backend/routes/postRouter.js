import express from "express";
import { createPost, getAllPosts, getPostBySlug, updatePost, deletePost, toggleBookmark } from '../controllers/postController.js';
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router();

//public routes:
router.get("/",getAllPosts);
router.get("/:slug",getPostBySlug);

//protected routes:
router.post("/",protect,createPost);
router.put("/:id",protect,updatePost);
router.delete("/:id",protect,deletePost);
router.put("/:id/bookmark",protect,toggleBookmark);

export default router;
