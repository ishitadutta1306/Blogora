import { UserRound, UserRoundPlus, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
const API=import.meta.env.VITE_API_URL;

const Register=()=>{
    const [fullName, setFullName]=useState("");
    const [username, setUsername]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [showPassword, setShowPassword]=useState(false);

    const navigate=useNavigate();
    const { login }=useAuth();

    const handleRegister=async(e)=>{
        e.preventDefault();

        try{
            //send POST request to backend register route
            const res=await axios.post(`${API}/api/users/register`,{
                fullName, username, email, password, 
                authProvider: "email",
            });

            //call the login() from AuthContext.jsx
            // login(res.data.user, res.data.token);   //save the user & token globally

            toast.success("Registered successfully!");

            //navigate user to login page
            navigate("/login");
        }
        catch(err){
            console.log(err.response?.data);
            toast.error(err.response?.data?.message || "Signup failed!");
        }
    }
    
    return(
        <>
            {/* Register page div */}
            <div className="min-h-screen flex justify-center items-center">
                {/* Register box container */}
                <div className="max-w-md w-full bg-white shadow-lg p-8 rounded-xl">
                    {/* Header */} 
                    <div className="flex flex-col items-center">
                        <div className="flex justify-center items-center border rounded-full p-4">
                            <UserRoundPlus className="h-12 w-12 text-[#a13ab0]"/>
                        </div>
                        <p className="text-center text-2xl font-semibold mt-2">Create Account</p>
                    </div>
                    
                    {/* Form */}
                    <form className="mt-6 space-y-4" onSubmit={handleRegister}>
                        {/* Full name */}
                        <div className="flex items-center px-3 py-2 gap-2 border rounded-lg">
                            <UserRoundPlus/>
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                className="w-full outline-none"
                                value={fullName}
                                onChange={(e)=>setFullName(e.target.value)}
                            />
                        </div>

                        {/* Username */}
                        <div className="flex items-center px-3 py-2 gap-2 border rounded-lg">
                            <UserRound/>
                            <input 
                                type="text" 
                                placeholder="Username" 
                                className="w-full outline-none"
                                value={username}
                                onChange={(e)=>setUsername(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div className="flex items-center px-3 py-2 gap-2 border rounded-lg">
                            <Mail/>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="w-full outline-none"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="flex items-center px-3 py-2 gap-2 border rounded-lg">
                            <Lock/>
                            <input 
                                type={showPassword? "text" : "password"} 
                                placeholder="Password" 
                                value={password}
                                className="w-full outline-none"
                                onChange={(e)=>{
                                    setPassword(e.target.value);
                                    if (e.target.value===""){   //if password field empty- reset state
                                        setShowPassword(false);
                                    }
                                }}
                            />
                            {/* Conditionally render the EyeOff & Eye icons: */}
                            {/* When password hidden */}
                            {password.length>0 && !showPassword && (
                                <EyeOff className="text-gray-500 cursor-pointer" 
                                    onClick={()=>setShowPassword(true)}
                                />
                            )}

                            {/* When password shown */}
                            {password.length>0 && showPassword && (
                                <Eye className="text-gray-500 cursor-pointer"
                                    onClick={()=>setShowPassword(false)}
                                />
                            )}
                        </div>

                        {/* Sign up button */}
                        <button 
                            type="submit"
                            className="bg-[#a13ab0] text-white w-full flex justify-center items-center gap-1 py-2 rounded-lg hover:cursor-pointer"
                        >
                            <UserRoundPlus className="h-5 w-5"/>
                            <span>Sign Up</span>
                        </button>

                        <p className="text-center text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="text-[#a13ab0] font-medium hover:cursor-pointer hover:underline">Login</a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;
