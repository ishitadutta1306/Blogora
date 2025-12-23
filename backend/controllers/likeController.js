import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import Notification from "../models/Notification.js";

//Like or unlike a post
export const toggleLikePost=async(req,res)=>{
    try{
        //find the post in db & check if it exists
        const post=await Post.findById(req.params.postId);
        if (!post){
            return res.status(404).json({message: "Post not found"});
        }

        //check if the user already liked the post
        if (post.likes.includes(req.user.id)){
            //unlike
            post.likes.pull(req.user.id);
        }
        else{
            //like the post
            post.likes.push(req.user.id);

            //create notification only if the liker is not the post owner
            if (post.author.toString() !== req.user.id) {
                await Notification.create({
                    type: "like",
                    sender: req.user.id,
                    recipient: post.author,
                    post: post._id
                });
            }
        }

        //update the like count in db
        post.likeCount=post.likes.length;

        //save to db
        await post.save();

        const liked = post.likes.includes(req.user.id);

        res.status(200).json({
            // message: post.likes.includes(req.user.id) ? "Post liked" : "Post unliked",
            liked,
            likeCount: post.likeCount
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Like/unlike comment
export const toggleLikeComment=async(req,res)=>{
    try{
        //find comment
        const comment=await Comment.findById(req.params.commentId);
        if (!comment){
            return res.status(404).json({message: "Comment not found"});
        }

        //check if the user has liked the post
        if (comment.likes.includes(req.user.id)){
            //unlike
            comment.likes.pull(req.user.id);
        }
        else{
            //like
            comment.likes.push(req.user.id);
        }

        await comment.save();

        res.status(200).json({
            message: comment.likes.includes(req.user.id) ? "Comment liked" : "Comment unliked"
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Get users who liked a post (for Like Modal)
export const getPostLikes=async(req,res)=>{
    const post=await Post.findById(req.params.postId).populate("likes","username profilePic");

    if (!post){
        return res.status(404).json({ message: "Post not found" });
    } 

    res.json(post.likes);
};
