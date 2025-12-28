import { CircleUserRound, ThumbsUp, MessageCircle, Bookmark } from 'lucide-react'
import BlogPlaceholderImage from '../assets/blog-placeholder.png'
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import CommentsModal from './CommentsModal';
const API=import.meta.env.VITE_API_URL;

const BlogCard=({post})=>{
    const navigate=useNavigate();
    const { title, content, coverImage, authorId, authorName, username, profilePic, likeCount, commentCount, createdAt, slug }=post;

    const [bookmarked, setBookmarked]=useState(post.isBookmarked || false);

    const loggedInUser=JSON.parse(localStorage.getItem("user"));
    // const isBookmarked=loggedInUser?.bookmarks?.includes(post._id) || post.bookmarked;

    const [liked, setLiked]=useState(post.isLiked);
    const [likes, setLikes]=useState(post.likeCount);

    const [showComments, setShowComments]=useState(false);
    const [commentCountState, setCommentCountState]=useState(commentCount);

    const getImageUrl=(image) => {
        if (!image){
            return BlogPlaceholderImage;
        } 
        if (image.startsWith("http")){
            return image;
        } 
        if (image.startsWith("/uploads")){
            return `${API}${image}`;
        } 
        return `${API}/uploads/${image}`;
    };

    const toggleLike=async (e)=>{
        const token=localStorage.getItem("token");

        // const res=await axios.post(`http://localhost:5000/api/likes/post/${post._id}`, {},{ 
        const res=await axios.post(`${API}/api/likes/post/${post._id}`, {},{ 
            headers: { Authorization: `Bearer ${token}` } 
        });

        setLiked(res.data.liked);
        setLikes(res.data.likeCount);
    };

    const toggleBookmark=async(e)=>{
        try {
            const token=localStorage.getItem("token");

            const res=await axios.put(`${API}/api/posts/${post._id}/bookmark`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            //update localStorage user
            const storedUser=JSON.parse(localStorage.getItem("user"));

            if (res.data.bookmarked){
                storedUser.bookmarks.push(post._id);
                toast.success("Added to bookmarks! ⭐");
            } 
            else{
                storedUser.bookmarks=storedUser.bookmarks.filter(id=>id!==post._id);
                toast("Removed from bookmarks! ❌");
            }

            localStorage.setItem("user", JSON.stringify(storedUser));
            setBookmarked(res.data.bookmarked);
        } 
        catch (err) {
            toast.error("Bookmark failed!");
            console.error(err);
        }
    };

    return(
        // Card container
        <div className='w-full md:w-1/3 flex justify-between items-center p-4 hover:cursor-pointer'>
            {/* Left section */}
            <div className='flex flex-col w-2/3'>
                <div>
                    {/* User details */}
                    <div onClick={()=>navigate(`/profile/${authorId}`)} className='flex items-center gap-1 mb-2'>
                        {profilePic ? (
                            <img src={profilePic} alt="" className='h-6 w-6 rounded-full'/>
                        ) : (
                            <CircleUserRound className='h-5 w-5'/>
                        )}
                        <span className='text-sm hover:underline'>{authorName || username}</span>
                    </div>

                    {/* Blog details */}
                    <div onClick={()=>navigate(`/post/${slug}`)} className='flex flex-col mr-4'>
                        <p className='text-2xl font-bold mb-2 line-clamp-2'>{title}</p>
                        <p className="text-md mb-2 line-clamp-3">
                            {content.replace(/<[^>]+>/g, "")}
                        </p>
                    </div>
                </div>

                {/* Action group: date like comment */}
                <div className='flex items-center mb-2'>
                    <p className='text-xs'>{new Date(createdAt).toLocaleDateString("en-US",{
                        month: "short",
                        day: "2-digit"
                    })}</p>

                    <ThumbsUp onClick={toggleLike} className={`ml-6 h-5 w-5 hover:cursor-pointer ${liked ? "fill-black" : ""}`}/>
                    <span className='text-xs font-bold ml-1'>{likes}</span>

                    <MessageCircle onClick={() => setShowComments(true)} className='ml-3 h-5 w-5 hover:cursor-pointer'/>
                    <span className='text-xs font-bold ml-1'>{commentCountState}</span>

                    <Bookmark onClick={toggleBookmark} className={`ml-3 h-5 w-5 cursor-pointer transition-colors ${bookmarked ? "fill-black text-black" : "text-black"}`}/>
                </div>
            </div>

            {/* Right section */}
            <div className='h-1/2 w-1/3 flex justify-end items-center'>
                <img src={getImageUrl(post.coverImage)} alt="" className='object-cover rounded-lg'/>
            </div>

            {showComments && (
                <CommentsModal
                    postId={post._id}
                    onClose={() => setShowComments(false)}
                    onCommentAdded={() => {
                        setCommentCountState(prev => prev + 1);
                    }}
                />
            )}
        </div>
    );
}

export default BlogCard;
