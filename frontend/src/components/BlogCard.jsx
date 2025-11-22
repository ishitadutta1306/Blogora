import { CircleUserRound, ThumbsUp, MessageCircle } from 'lucide-react'
import BlogPlaceholderImage from '../assets/blog-placeholder.png'

const BlogCard=()=>{

    return(
        // Card container
        <div className='w-full md:w-1/3 flex justify-between items-center p-4'>
            {/* Left section */}
            <div className='flex flex-col w-2/3'>
                <div>
                    {/* User details */}
                    <div className='flex items-center gap-2 mb-2'>
                        <CircleUserRound className='h-5 w-5'/>
                        <span className='text-sm'>Author</span>
                    </div>

                    {/* Blog details */}
                    <div className='flex flex-col mr-4'>
                        <p className='text-3xl font-bold mb-2'>Blog Title</p>
                        <p className='text-md mb-2 line-clamp-3'>Blog content- Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium alias quas facilis quia excepturi blanditiis ea vero. Corrupti autem quibusdam amet neque dolores culpa, sapiente consequatur molestiae laudantium, soluta porro?</p>
                    </div>
                </div>

                {/* Action group: date like comment */}
                <div className='flex items-center mb-2'>
                    <p className='text-xs'>Nov 11</p>

                    <ThumbsUp className='ml-4 h-5 w-5'/>
                    <span className='text-xs font-bold ml-0.5'>101</span>

                    <MessageCircle className='ml-2 h-5 w-5'/>
                    <span className='text-xs font-bold ml-0.5'>50</span>
                </div>
            </div>

            {/* Right section */}
            <div className='h-1/2 w-1/3 flex justify-end items-center'>
                <img src={BlogPlaceholderImage} alt="" className='object-cover rounded-lg'/>
            </div>
        </div>
    );
}

export default BlogCard;
