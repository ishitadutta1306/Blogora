import Post from '../models/Post.js'
import Comment from '../models/Comment.js'

//Like or unlike a post
export const toggleLikePost=async(req,res)=>{
    try{
        //find the post in db & check if it exists
        const post=await Post.findById(req.params.id);
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
        }

        //update the like count in db
        post.likeCount=post.likes.length;

        //save to db
        await post.save();

        res.status(200).json({
            message: post.likes.includes(req.user.id) ? "Post liked" : "Post unliked",
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
        const comment=await Comment.findById(req.params.id);
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
