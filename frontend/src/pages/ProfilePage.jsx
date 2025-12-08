import { CircleUserRound } from 'lucide-react'
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from 'react';
import BlogPlaceholderImage from '../assets/blog-placeholder.png'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProfilePage=()=>{
    const { id }=useParams();
    const navigate=useNavigate();

    const [activeTab, setActiveTab]=useState("Posts");  // "Posts" | "Followers" | "Following"
    const [profile, setProfile]=useState(null);

    useEffect(()=>{
        fetchProfile();
    },[id]);

    const fetchProfile=async()=>{
        try{
            const res=await axios.get(`http://localhost:5000/api/users/profile/${id}`);
            setProfile(res.data);
        }
        catch(err){
            console.error(err);
        }
    }

    if (!profile){
        return <p className="ml-120 mt-30">Loading...</p>;
    } 

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
                        {profile.profilePic ? (
                            <img src={profile.profilePic} className="h-18 w-18 rounded-full" />
                        ) : (
                            <CircleUserRound className='h-16 w-16'/>
                        )}
                    </div>

                    {/* Right section */}
                    <div className='flex flex-col'>
                        {/* name */}
                        <p className='font-bold text-xl'>{profile.fullName}</p>
                        {/* username */}
                        <p className='font-semibold text-gray-700'>@{profile.username}</p>

                        {/* Stats section */}
                        <div className='flex gap-24 mt-4 pb-4'>
                            {/* Posts */}
                            <div 
                                className={`text-center font-semibold hover:cursor-pointer ${activeTab==="Posts" ? "font-bold" : "text-gray-600"}`} 
                                
                                onClick={()=>setActiveTab("Posts")}>
                                    <button>Posts</button>
                                    <p>{profile.posts.length}</p>
                            </div>

                            {/* Followers */}
                            <div 
                                className={`text-center font-semibold hover:cursor-pointer ${activeTab==="Followers" ? "font-bold" : "text-gray-600"}`} 
                                
                                onClick={()=>setActiveTab("Followers")}>
                                    <button>Followers</button>
                                    <p>{profile.followers.length}</p>
                            </div>

                            {/* Following */}
                            <div  
                                className={`text-center font-semibold hover:cursor-pointer ${activeTab==="Following" ? "font-bold" : "text-gray-600"}`} 
                                
                                onClick={()=>setActiveTab("Following")}>
                                    <button>Following</button>
                                    <p>{profile.following.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower half: Shows lists of "Posts" OR List of "Followers" with "Follow/Unfollow" button OR List of "Following" with "Unfollow" button */}
                <div className='w-full pl-24 mt-6'>
                    {/* Posts */} 
                    {activeTab === "Posts" && profile.posts.map(post => (
                        <div 
                            key={post._id}
                            onClick={() => navigate(`/post/${post.slug}`)}
                            className="flex justify-between items-center mb-5 cursor-pointer"
                        >
                        <div className="flex flex-col w-2/3">
                            <p className="text-xl font-bold">{post.title}</p>
                            <p className="text-sm text-gray-700 line-clamp-3">{post.content}</p>
                        </div>

                        <img 
                            src={post.coverImage || BlogPlaceholderImage}
                            className="h-20 w-30 object-cover rounded-lg"
                        />
                        </div>
                    ))}

                    {/* Followers */}
                    {activeTab === "Followers" && profile.followers.map(user => (
                        <div key={user._id} className='flex justify-between py-2'>
                            <div className='flex gap-3'>
                                <CircleUserRound />
                                <div>
                                    <p>{user.fullName}</p>
                                    <p className='text-xs text-gray-500'>@{user.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Following */} 
                    {activeTab === "Following" && profile.following.map(user => (
                        <div key={user._id} className='flex justify-between py-2'>
                            <div className='flex gap-3'>
                                <CircleUserRound />
                                <div>
                                    <p>{user.fullName}</p>
                                    <p className='text-xs text-gray-500'>@{user.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ProfilePage;
