import Tag from '../models/Tag.js'

//Create new tag
export const createTag=async(req,res)=>{
    try{
        //extract name & description of the tag
        const {name,description}=req.body;
        if (!name){
            return res.status(400).json("Tag name is required");
        }

        //check if the tag exists in db
        const existing=await Tag.findOne({name});
        if (existing){
            return res.status(400).json({message: "Tag already exists"});
        }
        else{
            const tag=new Tag({name,description});
            await tag.save();
            return res.status(201).json({tag, message: "Tag created successfully"});
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Get all tags
export const getAllTags=async(req,res)=>{
    try{
        const tags=await Tag.find().sort({createdAt: -1});

        res.status(200).json(tags);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}
