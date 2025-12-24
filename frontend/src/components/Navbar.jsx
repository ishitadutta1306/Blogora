import { Menu, Search, SquarePen, Bell, CircleUserRound } from 'lucide-react'
import logo from '../assets/logo.png';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import UserProfileModal from './UserProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar=()=>{
    const [isSidebarOpen, setIsSidebarOpen]=useState(true);
    const toggleSidebar=()=>{
        setIsSidebarOpen(prev=>!prev);
    }

    // const [isNotificationModalOpen, setIsNotificationModalOpen]=useState(false);
    // const toggleNotificationModal=()=>{
    //     setIsNotificationModalOpen(prev=>!prev);
    //     setIsUserProfileModalOpen(false);
    // }

    //search bar 
    const [query, setQuery]=useState("");
    const [results, setResults]=useState({ users: [], posts: [] });
    const [showResults, setShowResults]=useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults({ users: [], posts: [] });
            return;
        }

        const timeout=setTimeout(async () => {
            const res=await axios.get(`http://localhost:5000/api/search?q=${query}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setResults(res.data);
            setShowResults(true);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        const close=() => setShowResults(false);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);

    const [isUserProfileModalOpen, setIsUserProfileModalOpen]=useState(false);
    const toggleUserProfileModal=()=>{
        setIsUserProfileModalOpen(prev=>!prev);
        // setIsNotificationModalOpen(false);
    }

    const navigate=useNavigate();

    return(
        <>
            {/* Navbar container */}
            <nav className='fixed top-0 left-0 w-full z-50 bg-white flex justify-between items-center px-8 border-b border-[#F1F1F1]'>
                {/* Left side */}
                <div className='flex items-center'>
                    <button onClick={toggleSidebar} className='hover:cursor-pointer'>
                        <Menu className='h-6 w-6'/>
                    </button>

                    <div onClick={()=>navigate("/home")} className='flex items-center hover:cursor-pointer'>
                        <img src={logo} alt='logo' className='w-10 h-10 md:w-16 md:h-16 object-contain'/>
                        {/* <h1 className='font-bold text-lg md:text-xl'>Blogora</h1> */}
                        <h1 className="font-['Dancing_Script'] text-xl md:text-3xl font-extrabold">Blogora</h1>
                    </div>
                </div>

                {/* Center */}
                <div className='hidden sm:flex items-center h-10 w-full max-w-[180px] md:max-w-md px-3 border border-black rounded-3xl mx-4'>
                    <Search className='text-black'/>
                    <input 
                        type="text" 
                        placeholder='Search' 
                        className='ml-2 w-full outline-none text-md placeholder-gray-600'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                {/* Mobile Search Icon (visible only below sm) */}
                <button className="sm:hidden">
                    <Search className="h-6 w-6"/>
                </button>

                {showResults && (results.users.length || results.posts.length) && (
                    <div  onClick={(e) => e.stopPropagation()} className="absolute top-14 left-1/2 -translate-x-1/2 bg-white w-full max-w-md rounded-lg shadow-lg z-50 p-3">
                        {/* USERS */}
                        {results.users.map(user => (
                            <div
                                key={user._id}
                                onClick={() => {
                                navigate(`/profile/${user._id}`);
                                setShowResults(false);
                                }}
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {user.profilePic ? (
                                <img src={user.profilePic} className="h-8 w-8 rounded-full" />
                                ) : (
                                    <CircleUserRound />
                                )}
                                <div>
                                    <p className="font-medium">{user.fullName}</p>
                                    <p className="text-xs text-gray-500">@{user.username}</p>
                                </div>
                            </div>
                        ))}

                        {/* POSTS */}
                        {results.posts.map(post => (
                            <div
                                key={post._id}
                                onClick={() => {
                                navigate(`/post/${post.slug}`);
                                setShowResults(false);
                                }}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <p className="font-medium">{post.title}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Right side */}
                <div className='flex items-center gap-4 [&>*]:cursor-pointer'>   {/* [&>*]:apply cursor-pointer to all children */}
                    <div onClick={()=>navigate("/create")} className='flex items-center gap-1'>
                        <SquarePen/>
                        <span className='font-medium hidden md:inline'>Write</span>
                    </div>
                    {/* <Bell onClick={toggleNotificationModal}/> */}
                    <CircleUserRound onClick={toggleUserProfileModal}/>
                </div>  
            </nav>

            <Sidebar isOpen={isSidebarOpen} onClose={()=>setIsSidebarOpen(false)}/>
            {/* <NotificationModal isOpen={isNotificationModalOpen} onClose={()=>setIsNotificationModalOpen(false)}/> */}
            <UserProfileModal isOpen={isUserProfileModalOpen} onClose={()=>setIsUserProfileModalOpen(false)}/>
        </>
    );
}

export default Navbar;
