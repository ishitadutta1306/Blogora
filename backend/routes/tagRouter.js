import express from "express";
import { createTag, getAllTags } from "../controllers/tagController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router();

//public route:
router.get("/",getAllTags);

//protected route:
router.post("/",protect,createTag);

export default router;
