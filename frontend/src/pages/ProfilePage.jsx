import { CircleUserRound } from 'lucide-react'
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from 'react';
import BlogPlaceholderImage from '../assets/blog-placeholder.png'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import BlogCard from '../components/BlogCard';
const API=import.meta.env.VITE_API_URL;

const ProfilePage=()=>{
    const { user }=useAuth();   //logged-in user

    const { id }=useParams();
    const navigate=useNavigate();

    const [activeTab, setActiveTab]=useState("Posts");  // "Posts" | "Followers" | "Following"
    const [profile, setProfile]=useState(null);

    useEffect(()=>{
        fetchProfile();
    },[id]);

    const fetchProfile=async()=>{
        try{
            const res=await axios.get(`${API}/api/users/profile/${id}`);
            setProfile(res.data);
        }
        catch(err){
            console.error(err);
        }
    }

    if (!profile){
        return <p className="ml-120 mt-30">Loading...</p>;
    } 

    const isOwnProfile=user?._id === profile._id;
    const isFollowing=user && profile.followers.some(f => f._id === user._id);

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

    const handleFollow=async(targetUserId)=>{
        try{
            const token=localStorage.getItem("token");

            await axios.put(`${API}/api/users/follow/${targetUserId}`, {}, {headers: { Authorization: `Bearer ${token}`}});

            fetchProfile(); //refresh profile after follow/unfollow 
        }
        catch(err){
            console.error(err);
        }
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
                    <div className='flex justify-center items-center h-18 w-18 rounded-full'>
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

                        {/* follow/unfollow button */}
                        {!isOwnProfile && (
                            <button
                                onClick={() => handleFollow(profile._id)}
                                className={`mt-4 px-4 py-1 rounded-lg text-sm font-medium hover:cursor-pointer ${
                                isFollowing ? "bg-gray-300 text-black" : "bg-black text-white"
                                }`}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}

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
                            <p className="text-sm text-gray-700 line-clamp-3">
                                {post.content.replace(/<[^>]+>/g, "")}
                            </p>
                        </div>

                        <img 
                            src={getImageUrl(post.coverImage)}
                            className="h-20 w-30 object-cover rounded-lg"
                        />
                        </div>
                    ))}

                    {/* Followers */}
                    {activeTab === "Followers" && profile.followers.map(userItem => (
                        <div key={userItem._id} className='flex justify-between items-center py-2'>
                            {/* Left side */}
                            <div 
                                onClick={() => navigate(`/profile/${userItem._id}`)} 
                                className='flex items-center gap-3 hover:cursor-pointer'>
                                    <div className='flex justify-center items-center h-10 w-10 rounded-full'>
                                        {userItem.profilePic ? (
                                            <img src={userItem.profilePic} className="h-18 w-18 rounded-full" />
                                        ) : (
                                            <CircleUserRound className='h-16 w-16'/>
                                        )}
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='font-medium'>{userItem.fullName}</p>
                                        <p className='text-xs text-gray-600'>@{userItem.username}</p>
                                    </div>
                            </div>

                            {/* Right side */} 
                            {userItem._id !== user._id && (
                                <button 
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        handleFollow(userItem._id);
                                    }} 
                                    className='px-3 h-7 bg-black text-white rounded-lg text-sm hover:cursor-pointer'
                                >
                                    {profile.following.some(f=>f._id===userItem._id) ? "Unfollow" : "Follow"}
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Following */} 
                    {activeTab === "Following" && profile.following.map(userItem => (
                        <div key={userItem._id} className='flex justify-between items-center py-2'>
                            {/* Left side */} 
                            <div
                                onClick={() => navigate(`/profile/${userItem._id}`)}
                                className='flex items-center gap-3'>
                                <div className='flex justify-center items-center h-10 w-10 rounded-full'>
                                    {userItem.profilePic ? (
                                        <img src={userItem.profilePic} className="h-18 w-18 rounded-full" />
                                    ) : (
                                        <CircleUserRound className='h-16 w-16'/>
                                    )}
                                </div>

                                <div className='flex flex-col'>
                                    <p className='font-medium'>{userItem.fullName}</p>
                                    <p className='text-xs text-gray-600'>@{userItem.username}</p>
                                </div>
                            </div>

                            {/* Right side */} 
                            {userItem._id !== user._id && (
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleFollow(userItem._id);
                                }}>
                                    Unfollow
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ProfilePage;
