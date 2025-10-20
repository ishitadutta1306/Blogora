import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema(
    {
        type:{
            type: String,
            enum: ["like","comment","follow"],
            required: true,
        },
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        recipient:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        comment:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
        isRead:{
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);

module.exports=mongoose.model("Notification",notificationSchema);
