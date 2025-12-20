import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import BlogPlaceholderImage from '../assets/blog-placeholder.png'
import { CircleUserRound, Dot, ThumbsUp, MessageCircle } from 'lucide-react'
import { useState, useEffect } from "react"
import LikesModal from "../components/LikesModal"
import CommentsModal from "../components/CommentsModal"
import axios from "axios"
import { useParams } from "react-router-dom"

const BlogPage=()=>{
    const { slug }=useParams();

    const [post, setPost]=useState(null);

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const [loading, setLoading]=useState(true);

    const [showComments, setShowComments]=useState(false);
    const [showLikes, setShowLikes]=useState(false);

    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(()=>{
        const fetchPost=async()=>{
            try {
                //include proper slug handling and populate author/tags
                const res=await axios.get(`http://localhost:5000/api/posts/${slug}`,
                    {
                        headers:{
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setPost(res.data);
                setLiked(res.data.isLiked || false);
                setLikes(res.data.likeCount || 0);
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

    const toggleLike = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(`http://localhost:5000/api/likes/post/${post._id}`, {},
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

    return(
        <>
            <Navbar/>
            <Sidebar/>

            {/* Blog Page container */}
            <div className="flex justify-center pl-20">
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
                            <span className='text-md font-medium'>{post.author?.username}</span>
                        </div>
                        <Dot/>

                        {/* Blog details */}
                        <p className="text-sm font-medium">{(post.readingTime || 5) + " min read"}</p>
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
                            <img src={post.coverImage || BlogPlaceholderImage} alt="" className='h-full object-cover rounded-lg'/>
                        </div>
                    )}

                    {/* Blog Content */}
                    <div>
                        <div
                            className="max-w-none"
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
                />
            )}
        </>
    );
}

export default BlogPage;
