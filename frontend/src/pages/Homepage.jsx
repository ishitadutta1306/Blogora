import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BlogCard from "../components/BlogCard";
import NotificationModal from "../components/NotificationModal";

const Homepage=()=>{
    return(
        <>
            <Navbar/>
            <NotificationModal/>
            <Sidebar/>

            <div className="flex justify-center">
                <div className="w-full px-4 sm:px-2 pt-20 flex flex-col items-center space-y-6">
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                </div>
            </div>
        </>
    );
}

export default Homepage;
