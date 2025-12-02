import backgroundImg from '../assets/landing-page-bg.jpg'
import logo from '../assets/logo.png'
import { FaGithub, FaLinkedin } from "react-icons/fa";

const LandingPage=()=>{
    return(
        <div style={{backgroundImage: `url(${backgroundImg})`}} className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col">
            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 md:px-16">
                {/* Left side */}
                <div className="flex items-center gap-2">
                    <img src={logo} alt='logo' className='w-10 h-10 md:w-16 md:h-16 object-contain'/>
                    <h1 className="font-['Dancing_Script'] text-xl md:text-3xl font-extrabold">Blogora</h1>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4 text-sm md:text-base">
                    {/* <button className="hover:cursor-pointer">🔥Popular</button> */}
                    <button className="hover:cursor-pointer hover:underline">Log In</button>
                    <button className="bg-[#f7f7f7] border-solid rounded-full px-4 py-2 hover:cursor-pointer">Get Started</button>
                </div>
            </nav>

            {/* Body */}
            <div className="flex flex-col md:flex-row items-start md:items-center px-6 md:px-24 mt-6 md:mt-12">
                <div className="md:w-2/3 space-y-6">
                    <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-4 leading-tight">Where Stories Find Their Voice</h1>
                    <p className="text-md sm:text-md md:text-xl">Discover thoughtful articles, fresh ideas, and perspectives that inspire curiosity and creativity.</p>
                    <button className="bg-[#a13ab0] text-white text-lg border-solid rounded-full mt-4 px-6 py-2 hover:cursor-pointer">Start blogging</button>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto h-12 flex justify-center items-center gap-6">
                <a href="https://github.com/ishitadutta1306/Blogora" target="_blank"><FaGithub className="h-6 w-6 hover:opacity-60"/></a>
                <a href="https://www.linkedin.com/in/ishita-dutta-86a080204/" target="_blank"><FaLinkedin className="h-6 w-6 hover:opacity-60"/></a>
            </footer>
        </div>
    );
}

export default LandingPage;
