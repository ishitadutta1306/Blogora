import express from "express";
import { addComment, getAllComments, deleteComment, replyToComment } from "../controllers/commentController";
import { protect } from "../middleware/authMiddleware";

const router=express.Router();

//public route:
router.get("/:postId",getAllComments);

//protected routes:
router.post("/",protect,addComment);
router.delete("/:id",protect,deleteComment);
router.post("/reply/:id",protect,replyToComment);

export default router;
