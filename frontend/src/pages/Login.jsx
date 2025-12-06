import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login=()=>{
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [showPassword, setShowPassword]=useState(false);

    const navigate=useNavigate();
    
    const { login }=useAuth();

    const handleLogin=async()=>{
        try{
            //send POST request to backend login route
            const res=await axios.post("http://localhost:5000/api/users/login",{
                email, password,
            });

            //call the login() from AuthContext.jsx
            login(res.data.user,res.data.token);   //save the user & token globally 

            //navigate user to homepage
            navigate("/home");
        }
        catch(err){
            console.log(err.response?.data);
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return(
        <>
            {/* Login page div */}
            <div className="min-h-screen flex justify-center items-center">
                {/* Login box container */}
                <div className="max-w-md w-full bg-white shadow-lg p-8 rounded-xl">
                    {/* Header */}
                    <div className="flex flex-col items-center">
                        <div className="flex justify-center items-center border rounded-full p-4">
                            <LogIn className="h-12 w-12 text-[#a13ab0]"/>
                        </div>
                        <p className="text-center text-2xl font-semibold mt-2">Welcome Back!</p>
                    </div>

                    {/* Form */}
                    <div className="mt-6 space-y-4">
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

                        {/* Login button */}
                        <button 
                            className="bg-[#a13ab0] text-white w-full flex justify-center items-center gap-1 py-2 rounded-lg hover:cursor-pointer"
                            onClick={handleLogin}
                        >
                            <LogIn className="h-5 w-5"/>
                            <span>Login</span>
                        </button>

                        <p className="text-center text-sm">
                            Don't have an account?{" "}
                            <a href="/register" className="text-[#a13ab0] font-medium hover:cursor-pointer hover:underline">Sign up</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
