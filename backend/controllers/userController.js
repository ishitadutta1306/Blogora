import User from '../models/User'
import Post from '../models/Post'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//generate jwt token
const generateToken=(userId)=>{
    return jwt.sign(
        {id: userId},   //payload: js object contains the user's data (here, userId) 
        process.env.JWT_SECRET,  //signature: JWT_SECRET
        {expiresIn: "7d"}   //option: to set expiration time 
    );
}

//Register:
export const registerUser=async(req,res)=>{
    try{
        //receive user data from client(request)
        const {fullName,username,email,password,googleId,authProvider}=req.body;   //take req.body object & destructure the LHS properties

        //check db if email or username exists
        const existingUser=await User.findOne({$or: [{email},{username}]});
        if (existingUser){
            return res.status(400).json({message: "Email or username already exists"});
        }

        //hash password
        let hashedPassword;
        if (authProvider==="email"){
            if (!password){
                return res.status(400).json({message: "Password is required"});
            }
            hashedPassword=await bcrypt.hash(password,10);
        }

        //store the new record: create a new user model instance & save the new user document 
        const newUser=new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            googleId,
            authProvider
        });
        const savedUser=await newUser.save();

        //generate JWT token
        const token=generateToken(savedUser._id);   // _id: unique identifier for every document in mongodb- automatically created when we save a document into a mongodb collection 

        //send response back with the user info & auth token 
        res.status(201).json({
            user: savedUser,    //send user info of the newly created user document 
            token
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Login:
export const loginUser=async(req,res)=>{
    try{
        //receive user data
        const {email,password,authProvider}=req.body;

        //check in db if user exists
        const user=await User.findOne({email});
        if (!user){
            return res.status(400).json({message: "User not found"});
        }

        //match hashed password
        if (authProvider==="email"){
            if (!password){
                return res.status(400).json({message: "Password is required"});
            }

            //compare req.body.password (req) with user.password(db)
            const isMatch=await bcrypt.compare(password,user.password);
            if (!isMatch){
                return res.status(400).json({message: "Invalid credentials"});
            }
        }

        //generate JWT token
        const token=generateToken(user._id);

        //send back response
        res.status(200).json({
            user,
            token
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//