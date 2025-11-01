import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import userRoutes from './routes/userRouter.js'

const app=express();
const PORT=process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//Routes:
app.use('/api/users',userRoutes);

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
