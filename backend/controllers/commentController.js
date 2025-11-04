import Post from '../models/Post.js'
import Comment from '../models/Comment.js'

//Add comment
export const addComment=async(req,res)=>{
    try{
        //extract which post, which parentcomment & comment content from request body
        const {post,parentComment,content}=req.body;
        if (!content){
            return res.status(404).json({message: "Content not found"});
        }

        //find post in db
        const existingPost=await Post.findById(post);
        if (!existingPost){
            return res.status(404).json({message: "Post not found"});
        }

        //create new comment instance in db & save to db
        const comment=new Comment({
            post,
            user: req.user.id,
            parentComment: parentComment || null,
            content
        });
        await comment.save();

        //add this comment to the post's comment's array
        existingPost.comments.push(comment._id);
        await existingPost.save();

        //Notification: Comment on post
        if (existingPost.user.toString() !== req.user.id) {
            await Notification.create({
                type: "comment",
                sender: req.user.id,
                recipient: existingPost.user,
                post: post,
                comment: comment._id
            });
        }

        //Notification: Reply to comment
        if (parentComment) {
            const parent = await Comment.findById(parentComment);
            if (parent && parent.user.toString() !== req.user.id) {
                await Notification.create({
                    type: "comment",
                    sender: req.user.id,
                    recipient: parent.user,
                    post: post,
                    comment: comment._id
                });
            }
        }

        res.status(201).json({
            message: "Comment added successfully",
            comment
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Get all comments for a post
export const getAllComments=async(req,res)=>{
    try{
        //find all comments for a particular post
        const comments=await Comment.find({post: req.params.postId})
            .sort({createdAt: -1})
            .populate("user","username profilePic")
            .populate({
                path: "parentComment",
                select: "content user",  //replace object ids in 'parentComment' field & replace it with content & user
                populate: {path: "user", select: "username profilePic"}  //further: for 'user' field, replace object ids with username & profilePic
            });
        
        res.status(200).json(comments);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Delete comment
export const deleteComment=async(req,res)=>{
    try{
        //find if the comment exists
        const comment=await Comment.findById(req.params.commentId);
        if (!comment){
            return res.status(404).json({message: "Comment not found"});
        }

        //check if the logged-in user is authorized to delete the comment
        if (comment.user.toString()!==req.user.id){
            return res.status(403).json({message: "Unauthorized"});
        }

        // delete replies associated with this comment 
        await Comment.deleteMany({ parentComment: comment._id });

        //delete the comment
        await comment.deleteOne();

        res.status(200).json({message: "Comment deleted successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Reply to comment
export const replyToComment=async(req,res)=>{
    try{
        //get reply content from request
        const {content}=req.body;

        //find its parent comment
        const parentComment=await Comment.findById(req.params.commentId);  //entire document
        if (!parentComment){
            return res.status(404).json({message: "Parent comment not found"});
        }

        //create new comment instance
        const reply=new Comment({
            post: parentComment.post,
            user: req.user.id,
            parentComment: parentComment._id,   //the document's ObjectId("...")
            content: content
        });

        await reply.save();

        //Notify parent comment owner
        if (parentComment.user.toString() !== req.user.id) {
            await Notification.create({
                type: "comment",
                sender: req.user.id,
                recipient: parentComment.user,
                post: parentComment.post,
                comment: reply._id
            });
        }

        res.status(200).json({
            message: "Replied to comment successfully",
            reply
        });

    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}
