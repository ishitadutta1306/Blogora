import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import BlogPlaceholderImage from '../assets/blog-placeholder.png'
import { CircleUserRound, Dot, ThumbsUp, MessageCircle, SquarePen, Trash, Bookmark } from 'lucide-react'
import { useState, useEffect } from "react"
import LikesModal from "../components/LikesModal"
import CommentsModal from "../components/CommentsModal"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import DeleteConfirmModal from "../components/DeleteConfirmModal"
import toast from "react-hot-toast";
const API=import.meta.env.VITE_API_URL;

const BlogPage=()=>{
    const { slug }=useParams();
    const navigate=useNavigate();

    const [post, setPost]=useState(null);

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const [likes, setLikes] = useState(0);

    const [loading, setLoading]=useState(true);

    const [showComments, setShowComments]=useState(false);
    const [showLikes, setShowLikes]=useState(false);

    const [selectedPost, setSelectedPost] = useState(null);

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const isOwner = loggedInUser?._id === post?.author?._id;

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(()=>{
        const fetchPost=async()=>{
            try {
                //include proper slug handling and populate author/tags
                const res=await axios.get(`${API}/api/posts/${slug}`,
                    {
                        headers:{
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                // setPost(res.data);
                // setLiked(res.data.isLiked || false);
                // setLikes(res.data.likeCount || 0);
                // setBookmarked(res.data.isBookmarked);
                setPost(res.data);
                setLiked(res.data.isLiked);
                setBookmarked(res.data.isBookmarked);
                setLikes(res.data.likeCount);
            } 
            catch (err) {
                console.error("Error fetching post: ", err); 
            } 
            finally {
                setLoading(false);
            }
        }
        fetchPost();
    },[slug]);

    const calculateReadingTime=(html) => {
        const text=html.replace(/<[^>]+>/g, "");
        const words=text.trim().split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200)); //200 wpm
    };

    const getImageUrl=(image) => {
        if (!image){
            return BlogPlaceholderImage;
        }
        // already a full URL
        if (image.startsWith("http")) return image;

        // already contains /uploads
        if (image.startsWith("/uploads")) {
            return `${API}${image}`;
        }

        // filename only
        return `${API}/uploads/${image}`;
    };

    const toggleLike = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(`${API}/api/likes/post/${post._id}`, {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setLiked(res.data.liked);
            setLikes(res.data.likeCount);
        } 
        catch (err) {
            console.error("Like failed:", err);
        }
    };

    if (loading){
        return <p className="pt-20 text-center">Loading...</p>;
    }

    if (!post){
        return <p className="pt-20 text-center">Post not found</p>;
    }

    const handleCommentAdded = () => {
        setPost(prev => ({
            ...prev,
            commentCount: prev.commentCount + 1
        }));
    };

    const handleCommentDeleted = () => {
        setPost(prev => ({
            ...prev,
            commentCount: Math.max(0, prev.commentCount - 1)
        }));
    };

    // const toggleBookmark=async() => {
    //     const token=localStorage.getItem("token");

    //     const res=await axios.post(`${API}/api/bookmarks/post/${post._id}`, {},
    //         { headers: { Authorization: `Bearer ${token}` } }
    //     );

    //     setBookmarked(res.data.bookmarked);
    // };

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

    const handleDeletePost = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API}/api/posts/${post._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            //After delete: go to homepage
            navigate("/home");
        } 
        catch (err) {
            console.error("Failed to delete post:",err);
        }
    };

    return(
        <>
            <Navbar/>
            <Sidebar/>

            {/* Blog Page container */}
            <div className="flex justify-center pl-20 mb-6">
                {/* Blog container */}
                <div className="w-full max-w-3xl px-4 sm:px-2 pt-20 flex flex-col items-center">
                    {/* Blog title */}
                    <p className="text-3xl font-bold mb-4">{post.title}</p>
                    
                    {/* Post & user details container */}
                    <div className="flex items-center mb-4">
                        {/* User details */}
                        <div className='flex items-center gap-1 hover:cursor-pointer'>
                            {post.author?.profilePic ? (
                                <img src={post.author.profilePic} alt="" className="h-8 w-8 rounded-full"/>
                            ) : (
                                <CircleUserRound className='h-8 w-8'/>
                            )}
                            <span
                                onClick={() => navigate(`/profile/${post.author._id}`)}
                                className='text-md font-medium'>{post.author?.username}
                            </span>
                        </div>
                        <Dot/>

                        {/* Blog details */}
                        <p className="text-sm font-medium">{calculateReadingTime(post.content)} min read</p>
                        <Dot/>
                        <p className="text-sm font-medium">{new Date(post.createdAt).toLocaleDateString("en-US",{
                            month: "short",
                            day: "2-digit"
                        })}</p>
                    </div>

                    {/* Action group */}
                    <div className='flex items-center mb-4'>
                        <ThumbsUp onClick={toggleLike} className={`h-6 w-6 cursor-pointer ${liked ? "fill-black" : ""}`}/>
                        <span onClick={() => setShowLikes(true)} className="text-sm font-bold ml-1 hover:cursor-pointer">
                            {likes}
                        </span>

                        <button onClick={() => {
                            setSelectedPost(post);
                            setShowComments(true);
                        }}
                            className="hover:cursor-pointer">
                            <MessageCircle className='ml-2 h-6 w-6'/>
                        </button>
                        <span className='text-sm font-bold ml-1'>{post.commentCount}</span>

                        <Bookmark onClick={toggleBookmark} className={`ml-3 h-6 w-6 cursor-pointer transition-colors ${bookmarked ? "fill-black text-black" : "text-black"}`}/>
                    </div>

                    {/* EDIT / DELETE - only for blog's author */} 
                    <div className="flex items-center mb-4 mt-2">
                        {isOwner && (
                            <div className="flex gap-4 text-sm font-semibold">
                                <button
                                    onClick={() => navigate(`/edit-post/${post.slug}`)}
                                    className="hover:cursor-pointer"
                                >
                                    <SquarePen/>
                                </button>

                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="hover:cursor-pointer"
                                >
                                    <Trash/>
                                </button>

                                
                            </div>
                        )}
                    </div>

                    {/* Topics tags */}
                    <div className="flex items-center mb-4 hover:cursor-pointer">
                        {post.tags?.map((tag,index)=>(
                            <span key={index} className="bg-gray-200 rounded-full px-2 py-1 mr-2 text-xs font-medium">
                                {tag.name}
                            </span>
                        ))}
                    </div>

                    {/* Blog Image */}
                    {post.coverImage && (
                        <div className='h-64 w-[480px] flex justify-center items-center mb-4'>
                            <img src={getImageUrl(post.coverImage)} alt="" className='h-full object-cover rounded-lg'/>
                        </div>
                    )}

                    {/* Blog Content */}
                    <div>
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>
            </div>

            {showLikes && (
                <LikesModal 
                    postId={post._id} 
                    onClose={() => setShowLikes(false)} 
                />
            )}

            {showComments && (
                <CommentsModal
                    postId={post._id}
                    onClose={() => setShowComments(false)}
                    onCommentAdded={handleCommentAdded}
                    onCommentDeleted={handleCommentDeleted}
                />
            )}

            {showDeleteConfirm && (
                <DeleteConfirmModal
                    title="Delete this post?"
                    description="This action cannot be undone."
                    onCancel={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDeletePost}
                />
            )}
        </>
    );
}

export default BlogPage;
