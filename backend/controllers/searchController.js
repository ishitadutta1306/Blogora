import User from "../models/User.js";
import Post from "../models/Post.js";

export const globalSearch = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { q } = req.query;
    if (!q) return res.json({ users: [], posts: [] });

    const regex = new RegExp(q, "i"); // case-insensitive partial match

    const users = await User.find({
      _id: { $ne: currentUserId },  //exclude self 
      $or: [
        { fullName: regex },
        { username: regex }
      ]
    })
      .select("fullName username profilePic")
      .limit(5);

    const posts = await Post.find({
      title: regex,
      status: "published",
      author: { $ne: currentUserId }    //exclude own posts 
    })
      .select("title slug coverImage")
      .limit(5);

    res.json({ users, posts });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
};
