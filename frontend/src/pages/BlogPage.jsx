import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import BlogPlaceholderImage from '../assets/blog-placeholder.png'
import { CircleUserRound, Dot, ThumbsUp, MessageCircle } from 'lucide-react'
import { useState } from "react"
import CommentsModal from "../components/CommentsModal"

const BlogPage=()=>{
    const [showComments, setShowComments]=useState(false);

    const post={
        title: "Welcome to JavaScript Programming",
        content: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt quaerat ea facilis, perspiciatis et eaque amet unde officiis labore aliquid, omnis sunt tempore in nulla dicta recusandae! Nostrum, commodi dolor. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur excepturi iusto reiciendis voluptatem eligendi velit itaque nihil, provident ipsa odio consequuntur inventore soluta cupiditate culpa facilis omnis quaerat aut accusamus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur voluptatum quibusdam nihil cumque dolore assumenda architecto laudantium officia esse ad modi soluta illo recusandae, quod doloremque deserunt hic aliquam aut.",
        image: BlogPlaceholderImage,
        readingTime: 5,
        tags: ["programming","javascript","coding"],
        authorName: "Ishita Dutta",
        comments: ["Insightful!","Well written","Detailed"]
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
                            <CircleUserRound className='h-8 w-8'/>
                            <span className='text-md font-medium'>{post.authorName}</span>
                        </div>
                        <Dot/>

                        {/* Blog details */}
                        <p className="text-sm font-medium">{post.readingTime} min read</p>
                        <Dot/>
                        <p className="text-sm font-medium">Nov 27</p>
                    </div>

                    {/* Action group */}
                    <div className='flex items-center mb-4'>
                        <ThumbsUp className='h-6 w-6 cursor-pointer'/>
                        <span className='text-sm font-bold ml-0.5'>101</span>

                        <button onClick={()=>setShowComments(true)} className="hover:cursor-pointer">
                            <MessageCircle className='ml-2 h-6 w-6'/>
                        </button>
                        <span className='text-sm font-bold ml-0.5'>50</span>
                    </div>

                    {/* Topics tags */}
                    <div className="flex items-center mb-4 hover:cursor-pointer">
                        {post.tags.map((tag,index)=>(
                            <span key={index} className="bg-gray-200 rounded-full px-2 py-1 mr-2 text-xs font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Blog Image */}
                    <div className='h-64 w-[480px] flex justify-center items-center mb-4'>
                        <img src={BlogPlaceholderImage} alt="" className='h-full object-cover rounded-lg'/>
                    </div>

                    {/* Blog Content */}
                    <div>
                        <p className="font-medium text-lg">{post.content}</p>
                    </div>
                </div>
            </div>

            {showComments && (
                <CommentsModal 
                    comments={post.comments}
                    onClose={() => setShowComments(false)}
                />
            )}
        </>
    );
}

export default BlogPage;
