import { useState } from "react";
import { House, User, Rocket, Bookmark } from "lucide-react";
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar=({isOpen, onClose})=>{
    const [showMore, setShowMore]=useState(false);
    // const [openInterests, setOpenInterests]=useState(false);

    const { user }=useAuth();

    // const interestCategories=[
    //     "Programming",
    //     "Productivity",
    //     "Health",
    //     "AI & ML",
    //     "Design",
    //     "Career",
    //     "Finance",
    //     "Gaming",
    //     "Psychology",
    //     "Books",
    //     "Lifestyle"
    // ];

    // const visibleCategories=showMore ? interestCategories : interestCategories.slice(0,6); //show 6 categories by default 

    const linkClass=({isActive})=>
        `w-full flex items-center mb-4 gap-3 hover:font-semibold hover:cursor-pointer ${isActive ? "font-bold" : "text-black"
    }`;

    return(
        <div>
            {/* Sidebar container */}
            <div className={`bg-white fixed top-16 h-[calc(100%-4rem)] flex flex-col  w-56 z-40 py-4 px-8 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
                <NavLink to="/home" className={linkClass}>
                    <House/>
                    <span>Home</span>
                </NavLink>

                <NavLink to={`/profile/${user?._id}`} className={linkClass}>
                    <User/>
                    <span>Profile</span>
                </NavLink>

                {/* Interests dropdown */}
                {/* <div>
                    <button className="w-full flex items-center gap-3 hover:font-semibold hover:cursor-pointer" onClick={()=>setOpenInterests((prev)=>!prev)}>
                        <Rocket/>
                        <span className="flex items-center">
                            Interests
                        </span>
                    </button> */}

                    {/* <div className="ml-13 mt-2 space-y-1">
                        {visibleCategories.map((item)=>(
                            <p key={item} className="text-gray-800 hover:font-medium hover:cursor-pointer">{item}</p>
                        ))} */}

                        {/* See more/see less */}
                        {/* <button className="text-gray-500 text-xs hover:underline hover:cursor-pointer" onClick={()=>setShowMore((prev)=>!prev)}>
                            {showMore ? "See less" : "See more"}
                        </button> */}
                    {/* </div> */}
                {/* </div> */}

                {/* Divider */}
                {/* <div className="mt-6 -mx-8 pt-4 border-t border-[#dedede]"></div> */}

                {/* Saved Posts */}
                <NavLink to="/saved" className={linkClass}>
                    <Bookmark/>
                    <span>Saved Posts</span>
                </NavLink>
            </div>
        </div>
    );
}

export default Sidebar;
