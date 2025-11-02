import Post from '../models/Post.js'
import User from '../models/User.js'

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
export const getPostBySlug=async(req,res)=>{
    try{
        const post=await Post.findOne({slug: req.params.slug})
            .populate("author","username profilePic")   //only select the username & profilePic fields of author field
            .populate("tags","name")
            .populate({
                path: "comments",   //for comment field (means for every comment- select the following fields)
                populate: {path: "author", select: "username profilePic"}   //in comment field, in author nested field, select username & profilePic to show instead of author object ids
            });
        
        if (!post){
            return res.status(404).json({message: "Post not found"});
        }
        
        res.status(200).json(post);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Update post
export const updatePost=async(req,res)=>{
    try{
        //extract these fields from request body
        const {title,subtitle,content,coverImage,tags,status}=req.body;

        //find the post in db
        const post=await Post.findById(req.params.id);
        if (!post){
            return res.status(404).json({message: "Post not found"});
        }

        //check if the user is authorized to update this post
        if (post.author.toString()!==req.user.id){  //author fields contains object id: ObjectId("7834.."), it's then converted into string "7834.." & then compared
            return res.status(403).json({message: "Unauthorized"});
        }

        //Update post
        if (title){
            post.title=title;
        }
        if (subtitle){
            post.subtitle=subtitle;
        }
        if (content){
            post.content=content;
        }
        if (coverImage){
            post.coverImage=coverImage;
        }
        if (tags){
            post.tags=tags;
        }
        if (status){
            post.status=status;
        }

        //save the post to db
        await post.save();

        //send updated post as response
        res.status(200).json(post);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Delete post
export const deletePost=async(req,res)=>{
    try{
        //find the post in db
        const post=await Post.findById(req.params.id);
        if (!post){
            return res.status(404).json({message: "Post not found"});
        }

        //check if the user is authorized to delete it
        if (post.author.toString()!==req.user.id){
            return res.status(403).json({message: "Unauthorized"});
        }

        //remove it from db
        await post.remove();

        //remove reference of this post from the user's posts array
        await User.findByIdAndUpdate(
            req.user.id,    //find by this id
            {$pull: {posts: post._id}}  //$pull- remove a specific value from the document, here, from the 'posts' array- remove the given post id
        );

        res.status(200).json({message: "Post deleted successfully"});

    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}
