import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import BlogPlaceholderImage from '../assets/blog-placeholder.png'
import { CircleUserRound, Dot, ThumbsUp, MessageCircle } from 'lucide-react'
import { useState, useEffect } from "react"
import LikesModal from "../components/LikesModal"
import CommentsModal from "../components/CommentsModal"
import axios from "axios"
import { useParams } from "react-router-dom"

const BlogPage=({postId})=>{
    const { slug }=useParams();

    const [post, setPost]=useState(null);
    const [loading, setLoading]=useState(true);

    const [showComments, setShowComments]=useState(false);
    const [showLikes, setShowLikes]=useState(false);

    useEffect(()=>{
        const fetchPost=async()=>{
            try{
                const res=await axios.get(`http://localhost:5000/api/posts/${slug}`);
                setPost(res.data);
            }
            catch(err){
                console.error("Error fetching post: ",err);
            }
            finally{
                setLoading(false);
            }
        }
        fetchPost();
    },[slug]);

    if (loading){
        return <p className="pt-20 text-center">Loading...</p>;
    }

    if (!post){
        return <p className="pt-20 text-center">Post not found</p>;
    }

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
                        <ThumbsUp className='h-6 w-6 cursor-pointer'/>
                        <span 
                            onClick={()=>setShowLikes(true)}
                            className='text-sm font-bold ml-1 hover:cursor-pointer'>{post.likeCount}
                        </span>

                        <button onClick={()=>setShowComments(true)} className="hover:cursor-pointer">
                            <MessageCircle className='ml-2 h-6 w-6'/>
                        </button>
                        <span className='text-sm font-bold ml-1'>{post.commentCount}</span>
                    </div>

                    {/* Topics tags */}
                    <div className="flex items-center mb-4 hover:cursor-pointer">
                        {post.tags.map((tag,index)=>(
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
                        <p className="text-md whitespace-pre-wrap">{post.content}</p>
                    </div>
                </div>
            </div>

            {showLikes && (
                <LikesModal 
                    comments={post.comments} 
                    onClose={() => setShowLikes(false)} 
                />
            )}

            {showComments && (
                <CommentsModal 
                    users={post.likes}
                    onClose={() => setShowComments(false)}
                />
            )}
        </>
    );
}

export default BlogPage;
