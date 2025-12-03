import { UserRound, UserRoundPlus, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Register=()=>{
    const [password, setPassword]=useState("");
    const [showPassword, setShowPassword]=useState(false);
    
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
                    <div className="mt-6 space-y-4">
                        {/* Full name */}
                        <div className="flex items-center px-3 py-2 gap-2 border rounded-lg">
                            <UserRoundPlus/>
                            <input type="text" placeholder="Full Name" className="w-full outline-none"/>
                        </div>

                        {/* Username */}
                        <div className="flex items-center px-3 py-2 gap-2 border rounded-lg">
                            <UserRound/>
                            <input type="text" placeholder="Username" className="w-full outline-none"/>
                        </div>

                        {/* Email */}
                        <div className="flex items-center px-3 py-2 gap-2 border rounded-lg">
                            <Mail/>
                            <input type="email" placeholder="Email" className="w-full outline-none"/>
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
                        <button className="bg-[#a13ab0] text-white w-full flex justify-center items-center gap-1 py-2 rounded-lg">
                            <UserRoundPlus className="h-5 w-5"/>
                            <span>Sign Up</span>
                        </button>

                        <p className="text-center text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="text-[#a13ab0] font-medium hover:cursor-pointer hover:underline">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
