import express from "express";
import { getAllNotifications, markAsRead } from "../controllers/notificationController";
import { protect } from "../middleware/authMiddleware";

const router=express.Router();

//only protected routes:
router.get("/",protect,getAllNotifications);
router.put("/:id/read",protect,markAsRead);

export default router;
