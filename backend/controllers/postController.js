import Post from '../models/Post'
import User from '../models/User'
import Like from '../models/Like'
import Comment from '../models/Comment'
import mongoose from 'mongoose'

//Create post
export const createPost=async(req,res)=>{
    try{
        //extract the following fields from request body
        const {title,subtitle,content,coverImage,tags,status}=req.body;
        if (!title || !content){
            return res.status(400).json({message: "Title and content is required"});
        }

        //find & store the user's document
        const user=await User.findById(req.user.id);
        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        //create a new instance for Post document
        const newPost=new Post({
            title,
            subtitle,
            content,
            coverImage,
            tags,
            author: user._id,
            authorName: user.fullName,
            authorProfilePic: user.profilePic,
            status: status || "draft"
        });
        await newPost.save();   //save this document to Post db

        //add post reference to user db & save
        user.posts.push(newPost._id);
        await user.save();

        res.status(200).json(newPost);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Get all posts (in homepage)
export const getAllPosts=async(req,res)=>{
    try{
        //find all published posts present in db
        const posts=await Post.find({status: "published"})
            .sort({createdAt: -1})  //latest post 1st
            .populate("author","fullname username profilePic")  //replace object id of author field with the later fields
            .populate("tags","name")
            .select("title subtitle coverImage createdAt likeCount commentCount");  //return these specific fields

        //create a new array 'formattedPost' where each post object contains only the following field instead of whole document 
        const formattedPost=posts.map((post)=>({
            _id: post._id,
            title: post.title,
            subtitle: post.subtitle,
            coverImage: post.coverImage,
            authorName: post.author?.fullName,
            username: post.author?.username,
            profilePic: post.author?.profilePic,
            createdAt: post.createdAt,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            tags: post.tags
        }));

        res.status(200).json(formattedPost);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Get single post by slug
