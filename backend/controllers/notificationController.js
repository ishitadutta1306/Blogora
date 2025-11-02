import Notification from '../models/Notification.js'

//Get all notifications for a user
export const getAllNotifications=async(req,res)=>{
    try{
        const notifications=await Notification.find({recipient: req.user.id})
            .sort({createdAt: -1})
            .populate("sender","username profilePic")
            .populate("post","title")
            .populate("comment","content");
        
        res.status(200).json(notifications);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

//Mark notification as read
export const markAsRead=async(req,res)=>{
    try{
        //find notification & mark it as read 
        await Notification.findByIdAndUpdate(req.params.id,{isRead: true});

        res.status(200).json({message: "Notification marked as read"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}
