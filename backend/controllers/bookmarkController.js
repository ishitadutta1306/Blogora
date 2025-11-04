import Bookmark from '../models/Bookmark.js'

//Add or remove bookmark from a post
export const toggleBookmark=async(req,res)=>{
    try{
        const {postId}=req.body;
        if (!postId){
            return res.status(400).json({message: "Post Id is required"});
        }

        //check if the user has already bookmarked the post- each bookmark document contains the post id & user id
        const existing=await Bookmark.findOne({post: postId, user: req.user.id});   //find the 1st document that matches the given post id & user id 

        //check if bookmark exists
        if (existing){
            await Bookmark.findByIdAndDelete(existing._id);
            return res.status(200).json({message: "Removed bookmark from the post"});
        }
        else{
            const bookmark=new Bookmark({post: postId, user: req.user.id});
            await bookmark.save();
            return res.status(201).json({message: "Bookmarked the post"});
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//All bookmarks of a user
export const getAllBookmarks=async(req,res)=>{
    try{
        const bookmarks=await Bookmark.find({user: req.user.id})
            .sort({createdAt: -1})
            .populate("post","title subtitle coverImage");
        
        res.status(200).json(bookmarks);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}
