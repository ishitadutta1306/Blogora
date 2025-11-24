import { Menu, Search, SquarePen, Bell, CircleUserRound } from 'lucide-react'
import logo from '../assets/logo.png';
import { useState } from 'react';
import Sidebar from './Sidebar';
import NotificationModal from './NotificationModal';
import UserProfileModal from './UserProfileModal';

const Navbar=()=>{
    const [isSidebarOpen, setIsSidebarOpen]=useState(true);
    const toggleSidebar=()=>{
        setIsSidebarOpen(prev=>!prev);
    }

    const [isNotificationModalOpen, setIsNotificationModalOpen]=useState(false);
    const toggleNotificationModal=()=>{
        setIsNotificationModalOpen(prev=>!prev);
    }

    const [isUserProfileModalOpen, setIsUserProfileModalOpen]=useState(true);
    const toggleUserProfileModal=()=>{
        setIsUserProfileModalOpen(prev=>!prev);
    }

    return(
        <>
            {/* Navbar container */}
            <nav className='fixed top-0 left-0 w-full z-50 bg-white flex justify-between items-center px-8 border-b border-[#F1F1F1]'>
                {/* Left side */}
                <div className='flex items-center'>
                    <button onClick={toggleSidebar} className='hover:cursor-pointer'>
                        <Menu className='h-6 w-6'/>
                    </button>
                    <img src={logo} alt='logo' className='w-10 h-10 md:w-16 md:h-16 object-contain'/>
                    <h1 className='font-bold text-lg md:text-xl'>Blogora</h1>
                </div>

                {/* Center */}
                <div className='hidden sm:flex items-center h-10 w-full max-w-[180px] md:max-w-md px-3 border border-black rounded-3xl mx-4'>
                    <Search className='text-black'/>
                    <input type="text" placeholder='Search' className='ml-2 w-full outline-none text-md placeholder-gray-600'/>
                </div>
                {/* Mobile Search Icon (visible only below sm) */}
                <button className="sm:hidden">
                    <Search className="h-6 w-6"/>
                </button>

                {/* Right side */}
                <div className='flex items-center gap-4 [&>*]:cursor-pointer'>   {/* [&>*]:apply cursor-pointer to all children */}
                    <div className='flex items-center gap-1'>
                        <SquarePen/>
                        <span className='font-medium hidden md:inline'>Write</span>
                    </div>
                    <Bell onClick={toggleNotificationModal}/>
                    <CircleUserRound onClick={toggleUserProfileModal}/>
                </div>  
            </nav>

            <Sidebar isOpen={isSidebarOpen} onClose={()=>setIsSidebarOpen(false)}/>
            <NotificationModal isOpen={isNotificationModalOpen} onClose={()=>setIsNotificationModalOpen(false)}/>
            <UserProfileModal isOpen={isUserProfileModalOpen} onClose={()=>setIsUserProfileModalOpen(false)}/>
        </>
    );
}

export default Navbar;
