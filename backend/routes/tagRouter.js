import express from "express";
import { createTag, getAllTags } from "../controllers/tagController";
import { protect } from "../middleware/authMiddleware";

const router=express.Router();

//public route:
router.get("/",getAllTags);

//protected route:
router.post("/",protect,createTag);

export default router;
