import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect=async(req,res,next)=>{
    try{
        //extract token from header
        const token=req.headers.authorization?.split(" ")[1];   // <token> 

        //handle missing token
        if (!token){
            return res.status(401).json({message: "Token not found, authorization denied"});
        }

        //verify token
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        //attach user to req & exclude password field 
        req.user=await User.findById(decoded.id).select("-password");

        //pass the control to the next middleware/controller or continue the request
        next();
    }
    catch(err){
        console.error(err);
        res.status(401).json({message: "Token is invalid or expired"});
    }
}
