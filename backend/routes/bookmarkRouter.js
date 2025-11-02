import express from "express";
import { toggleBookmark, getAllBookmarks } from "../controllers/bookmarkController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router();

//all protected routes:
router.get("/",protect,getAllBookmarks);
router.post("/toggle",protect,toggleBookmark);

export default router;
