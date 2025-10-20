import mongoose from "mongoose";

const postSchema=new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true,
        },
        subtitle:{
            type: String,
            trim: true,
        },
        content:{
            type: String,
            required: true,
        },
        coverImage:{
            type: String,
        },
        readingTime:{
            type: Number,
        },
        tags:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tag",
            }
        ],

        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        authorName:{
            type: String,
        },
        authorProfilePic:{
            type: String,
        },

        likes:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Like",
            }
        ],
        comments:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            }
        ],
        likeCount:{
            type: Number,
            default: 0,
        },
        commentCount:{
            type: Number,
            default: 0,
        },

        slug:{  //generate URL by title 
            type: String,
            required: true,
            unique: true,
        },
        status:{
            type: String,
            enum: ["draft","published"],
            default: "draft",
        },
    },
    {timestamps:true}
);

postSchema.pre("validate",function(next){
    if (this.title && !this.slug){
        this.slug=this.title.trim().toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-");
    }
    next();
});

module.exports=mongoose.model("Post",postSchema);
