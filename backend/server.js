import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from './routes/userRouter.js'
import postRoutes from './routes/postRouter.js'
import commentRoutes from './routes/commentRouter.js'
import likeRoutes from './routes/likeRouter.js'
import bookmarkRoutes from './routes/bookmarkRouter.js'
import tagRoutes from './routes/tagRouter.js'
import notificationRoutes from './routes/notificationRouter.js'
import searchRoutes from './routes/searchRouter.js'
import aiRoutes from "./routes/aiRouter.js";

const app=express();
const PORT=process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Routes:
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/likes',likeRoutes);
app.use('/api/bookmarks',bookmarkRoutes);
app.use('/api/tags',tagRoutes);
app.use('/api/notifications',notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/ai", aiRoutes);

//Basic route
app.get('/',(req,res)=>{
    res.send('Welcome to Blogora backend');
});

//Connect to database & start the server
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connected");
    app.listen(PORT,()=>console.log(`Server running on PORT ${PORT}`));
})
.catch(error=>console.log("Error connecting to MongoDB",error));
