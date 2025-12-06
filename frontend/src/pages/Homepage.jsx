import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BlogCard from "../components/BlogCard";
import { useEffect, useState } from "react";
import axios from "axios";

const Homepage=()=>{
    const [posts, setPosts]=useState([]);

    useEffect(()=>{
        const fetchPosts=async()=>{
            try{
                const res=await axios.get("http://localhost:5000/api/posts");
                setPosts(res.data);   //array of formatted posts
            }
            catch(err){
                console.error("Error fetching posts: ",err);
            }
        }

        fetchPosts();
    },[]);

    return(
        <>
            <Navbar/>
            <Sidebar/>

            {/* Blogs list */}
            <div className="flex justify-center">
                <div className="w-full px-4 sm:px-2 pt-20 flex flex-col items-center space-y-6">
                    {posts.length===0 ? (
                        <p className="font-medium">No posts available</p>
                    ) : (
                        posts.map((post)=>
                            <BlogCard key={post.id} post={post}/>    
                        )
                    )}
                </div>
            </div>
        </>
    );
}

export default Homepage;
