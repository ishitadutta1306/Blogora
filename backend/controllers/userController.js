import User from '../models/User.js'
import Post from '../models/Post.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Comment from '../models/Comment.js'
import Like from '../models/Like.js'
import Notification from '../models/Notification.js'

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
        const {fullName,username,email,password,googleId,authProvider}=req.body;   //extract fields: take req.body object & destructure the LHS properties

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

//Get user profile data
export const getUserProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)   //id from URL parameter(values)
            //req.params: an object holding all parameters of the route (/:id= {id: ...} 
            .populate("followers","username profilePic")   //replace the object ids with the document(record) but only with username & profilePic field 
            .populate("following","username profilePic")
            .populate("posts");     //include all fields of a post's record 
        
        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Update user profile
export const updateUserProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id);   //attach req.user in auth middleware later

        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        const {username,email,bio,profilePic,socialLinks}=req.body;  //extract fields from req body

        if (username && username!==user.username){  //if req.body contains new username & it's not equal to the db's username
            //check if the new username is taken by any other user
            const exists=await User.findOne({username});    
            if (exists){
                return res.status(400).json({message: "Username already taken"});
            }
            user.username=username;   //update in db 
        }
        if (email && email!==user.email){
            const exists=await User.findOne({email});
            if (exists){
                return res.status(400).json({message: "Email already taken"});
            }
            user.email=email;
        }
        if (bio){
            user.bio=bio;
        }
        if (profilePic){
            user.profilePic=profilePic;
        }
        if (socialLinks){
            user.socialLinks=socialLinks;
        }

        const updatedUser=await user.save();

        res.status(200).json({
            user: updatedUser,
            message: "User details updated"
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Change password
export const changePassword=async(req,res)=>{
    try{
        //extract oldPassword & newPassword from request body
        const {oldPassword,newPassword}=req.body;
        if (!oldPassword || !newPassword){
            return res.status(404).json({message: "Old password or new password is missing"});
        }

        //check if user exists
        const user=await User.findById(req.user.id);
        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        //match the oldPassword with the password in db
        const isMatch= await bcrypt.compare(oldPassword,user.password);
        if (!isMatch){
            return res.status(400).json({message: "Old password incorrect"});
        }

        //check if oldPassword & newPassword are different
        if (oldPassword===newPassword){
            return res.status(400).json({message: "Old password cannot be same as new password"});
        }

        //hash the new password
        user.password=await bcrypt.hash(newPassword,10);

        //save to db
        await user.save();

        //send back response 
        res.status(200).json({message: "Password updated successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Forgot password
export const forgotPassword=async(req,res)=>{
    try{
        const {email}=req.body;
        if (!email){
            return res.status(400).json({message: "Email is required"});
        }

        const user=await User.findOne({email});
        if (!user){
            return res.status(404).json({message: "User not found"}); 
        }

        //generate reset token
        const resetToken=jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "15m"}
        );

        res.status(200).json({
            resetToken,
            message: "Password reset token generated successfully"
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Reset password
export const resetPassword=async(req,res)=>{
    try{
        //extract token from req.params: an object holding all parameters of the route (/:id= {id: ...}
        const {token}=req.params;

        const {newPassword}=req.body;
        if (!newPassword){
            return res.status(400).json({message: "Password is required"});
        }

        //verify token
        let decoded;    //if token is valid after decoding: decoded = { id: "<user's MongoDB _id>", iat: <timestamp>, exp: <timestamp> } 
        try{
            decoded=jwt.verify(token,process.env.JWT_SECRET);
        }
        catch(err){
            res.status(400).json({message: "Invalid or expired token"});
        }

        //check if user exists
        const user=await User.findById(decoded.id);
        if (!user){
            return res.status(404).json({message: "User not found"}); 
        }

        //hash the new password & save to db 
        user.password=await bcrypt.hash(newPassword,10);
        await user.save();

        res.status(200).json({message: "Password reset successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Follow/unfollow users
export const toggleFollowUser=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id);    //mongoose document object
        const userToFollow=await User.findById(req.params.id);

        if (!user || !userToFollow){
            return res.status(404).json({message: "User not found"});
        }

        if (user.following.includes(userToFollow._id)){
            //unfollow
            user.following.pull(userToFollow._id);
            userToFollow.followers.pull(user._id);
        }
        else{
            //follow
            user.following.push(userToFollow._id);
            userToFollow.followers.push(user._id);
        }

        await user.save();
        await userToFollow.save();

        res.status(200).json({
            followers: userToFollow.followers.length,
            following: user.following.length,
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Fetch followers
export const fetchFollowers=async(req,res)=>{
    try{
        //use user id from URL provided else use logged-in user's id 
        const userId=req.params.id || req.user.id;

        //replace followers field's object ids with actual user doc & include fullName, username & profilePic
        const user=await User.findById(userId).populate("followers","fullName username profilePic");  
        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({
            followers: user.followers,
            count: user.followers.length
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Fetch following
export const fetchFollowing=async(req,res)=>{
    try{
        //use user id from URL provided else use logged-in user's id 
        const userId=req.params.id || req.user.id;

        const user=await User.findById(userId).populate("following","fullName username profilePic");  
        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({
            following: user.following,
            count: user.following.length
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Fetch posts count
export const fetchPostCount=async(req,res)=>{
    try{
        const userId=req.params.id || req.user.id;

        //count documents in Post model for the user id
        const count=await Post.countDocuments({author: userId});

        res.status(200).json({postCount: count});

    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Delete account
export const deleteAccount=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id);
        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        //delete user's posts
        await Post.deleteMany({author: user._id});  //find every author with 'user._id' & then do deleteMany operation

        //delete likes & comments
        await Like.deleteMany({user: user._id});
        await Comment.deleteMany({user: user._id});

        //delete notifications
        await Notification.deleteMany({sender: user._id});

        //remove user from others' followers & following list
        await User.updateMany(
            {followers: user._id},   //find every user whose followers array contains this 'user._id' 
            {$pull: {followers: user._id}}   //remove this 'user._id' from all the matching users' followers array
        );
        await User.updateMany(
            {following: user._id},
            {$pull: {following: user._id}}
        );
        
        //delete the user document itself
        await User.findByIdAndDelete(user._id);

        res.status(200).json({message: "Account & all related data successfully deleted"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Search users
export const searchUsers=async(req,res)=>{
    try{
        //get search query
        const searchQuery=req.query.q;
        if (!searchQuery)
            return res.status(404).json({message: "Search query is missing"});

        //search & store usernames that match the search query 
        const users=await User.find(
            {username: {$regex: searchQuery, $options: "i"}}  //match usernames partially(regex) case-insensitive(options: "i")
        ).select("fullName username profilePic");   //include the only selected fields 

        res.status(200).json(users);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}
