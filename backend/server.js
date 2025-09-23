const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config();

const app=express();
const PORT=process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

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
