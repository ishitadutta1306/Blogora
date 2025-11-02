import mongoose from "mongoose";

const commentSchema=new mongoose.Schema(
    {
        post:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, 
        },
        parentComment:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        content:{
            type: String,
            trim: true,
            required: true,
        },
        likes:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Like",
            }
        ],
        likeCount:{
            type: Number,
            default: 0,
        },
    },
    {timestamps:true}
);

export default mongoose.model("Comment",commentSchema);
