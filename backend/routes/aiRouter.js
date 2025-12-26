import express from "express";
import { generateBlog, getAIUsage } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-blog", protect, generateBlog);
router.get("/usage", protect, getAIUsage);

export default router;
