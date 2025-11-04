import express from "express";
import { addComment, getAllComments, deleteComment, replyToComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router();

//public route:
router.get("/:postId",getAllComments);

//protected routes:
router.post("/",protect,addComment);
router.delete("/:commentId",protect,deleteComment);
router.post("/reply/:commentId",protect,replyToComment);

export default router;
