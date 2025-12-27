import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BlogCard from "../components/BlogCard";
import { useState, useEffect } from "react";
import axios from "axios";
const API=import.meta.env.VITE_API_URL;

const SavedPosts=()=>{
    const [posts, setPosts]=useState([]);

    useEffect(()=>{
        const fetchBookmarks=async()=>{
            const token=localStorage.getItem("token");
            const user=JSON.parse(localStorage.getItem("user"));

            if (!token || !user){
                return;
            } 

            const res=await axios.get(`${API}/api/users/${user._id}/bookmarks`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setPosts(res.data);
        };

        fetchBookmarks();
    },[]);

    return(
        <>
            <Navbar/>
            <Sidebar/>

            <div className="flex justify-center">
                <div className="w-full px-4 sm:px-2 pt-20 flex flex-col items-center space-y-6">
                    {/* Saved Posts list */}
                    {posts.length===0 ? (
                        <p className="font-medium">No saved posts yet.</p>
                    ) : (
                        posts.map((post)=>(
                            <BlogCard key={post._id} post={post} />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default SavedPosts;
