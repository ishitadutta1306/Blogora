import { CircleUserRound } from 'lucide-react'
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from 'react';
import BlogPlaceholderImage from '../assets/blog-placeholder.png'

const ProfilePage=()=>{
    const [activeTab, setActiveTab]=useState("Posts");  // "Posts" | "Followers" | "Following"

    return(
        <>
            <Navbar/>
            <Sidebar/>

            {/* Profile page container */}
            <div className='w-140 ml-120 mt-30 pr-24'>
                {/* Upper half */}
                <div className='flex gap-6'>
                    {/* Left section: profile pic */}
                    <div className='flex justify-center items-center h-18 w-18 rounded-full bg-gray-100'>
                        <CircleUserRound className='h-16 w-16'/>
                    </div>

                    {/* Right section */}
                    <div className='flex flex-col'>
                        {/* name */}
                        <p className='font-bold text-xl'>Ishita Dutta</p>
                        {/* username */}
                        <p className='font-semibold text-gray-700'>@ishitadutta</p>

                        {/* Stats section */}
                        <div className='flex gap-24 mt-4 pb-4'>
                            {/* Posts */}
                            <div 
                                className={`text-center font-semibold hover:cursor-pointer ${activeTab==="Posts" ? "font-bold" : "text-gray-600"}`} 
                                
                                onClick={()=>setActiveTab("Posts")}>
                                    <button>Posts</button>
                                    <p>10</p>
                            </div>

                            {/* Followers */}
                            <div 
                                className={`text-center font-semibold hover:cursor-pointer ${activeTab==="Followers" ? "font-bold" : "text-gray-600"}`} 
                                
                                onClick={()=>setActiveTab("Followers")}>
                                    <button>Followers</button>
                                    <p>250</p>
                            </div>

                            {/* Following */}
                            <div  
                                className={`text-center font-semibold hover:cursor-pointer ${activeTab==="Following" ? "font-bold" : "text-gray-600"}`} 
                                
                                onClick={()=>setActiveTab("Following")}>
                                    <button>Following</button>
                                    <p>91</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower half: Shows lists of "Posts" OR List of "Followers" with "Follow/Unfollow" button OR List of "Following" with "Unfollow" button */}
                <div className='w-full pl-24 mt-6'>
                    {activeTab==="Posts" && (
                        <div className="w-full flex justify-between items-center">
                            {/* Left: Blog details */}
                            <div className="flex flex-col w-2/3 mr-4">
                                <p className="text-xl font-bold mb-2">Blog Title</p>
                                <p className="text-sm text-gray-700 line-clamp-3">
                                    This is the blog excerpt... Lorem ipsum dolor sit amet consectetur 
                                    adipisicing elit. Officiis sed dolorem facere...
                                </p>
                            </div>

                            {/* Right: Image */}
                            <div className="flex justify-end">
                                <img 
                                    src={BlogPlaceholderImage} 
                                    alt="" 
                                    className="h-20 w-30 object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab==="Followers" && (
                        <div className='py-2'>
                            <div className='flex justify-between items-center py-2'>
                                {/* Left side */}
                                <div className='flex items-center gap-3'>
                                    <div className='flex justify-center items-center h-10 w-10 rounded-full'>
                                        <CircleUserRound className='h-10 w-10'/>
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='font-medium'>Harry Potter</p>
                                        <p className='text-xs text-gray-500'>@harrypotter</p>
                                    </div>
                                </div>
                                
                                {/* Right side */} 
                                <button className='px-3 py-1 bg-black text-white rounded-lg text-sm hover:cursor-pointer'>
                                    Follow
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab==="Following" && (
                        <div className='py-2'>
                            <div className='flex justify-between items-center py-2'>
                                {/* Left side */}
                                <div className='flex items-center gap-3'>
                                    <div className='flex justify-center items-center h-10 w-10 rounded-full'>
                                        <CircleUserRound className='h-10 w-10'/>
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='font-medium'>John Doe</p>
                                        <p className='text-xs text-gray-500'>@johndoe</p>
                                    </div>
                                </div>
                                
                                {/* Right side */} 
                                <button className='px-3 py-1 border rounded-lg text-sm hover:cursor-pointer'>
                                    Unfollow
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ProfilePage;
