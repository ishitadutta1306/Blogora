import { CircleUserRound, ThumbsUp, MessageCircle, Bookmark } from 'lucide-react'
import BlogPlaceholderImage from '../assets/blog-placeholder.png'
import { useNavigate } from 'react-router-dom';

const BlogCard=({post})=>{
    const navigate=useNavigate();
    const { title, content, coverImage, authorId, authorName, username, profilePic, likeCount, commentCount, createdAt, slug }=post;

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
                        <p className='text-2xl font-bold mb-2'>{title}</p>
                        <p className='text-md mb-2 line-clamp-3'>{content}</p>
                    </div>
                </div>

                {/* Action group: date like comment */}
                <div className='flex items-center mb-2'>
                    <p className='text-xs'>{new Date(createdAt).toLocaleDateString("en-US",{
                        month: "short",
                        day: "2-digit"
                    })}</p>

                    <ThumbsUp className='ml-6 h-5 w-5 hover:cursor-pointer'/>
                    <span className='text-xs font-bold ml-1'>{likeCount}</span>

                    <MessageCircle className='ml-3 h-5 w-5 hover:cursor-pointer'/>
                    <span className='text-xs font-bold ml-1'>{commentCount}</span>

                    <Bookmark className='ml-3 h-5 w-5 hover:cursor-pointer'/>
                </div>
            </div>

            {/* Right section */}
            <div className='h-1/2 w-1/3 flex justify-end items-center'>
                <img src={coverImage || BlogPlaceholderImage} alt="" className='object-cover rounded-lg'/>
            </div>
        </div>
    );
}

export default BlogCard;
