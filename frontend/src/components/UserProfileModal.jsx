import { CircleUserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserProfileModal=({isOpen, onClose})=>{
    if (!isOpen){
        return null;
    }

    //logout
    const { user, logout }=useAuth();
    const navigate=useNavigate();

    const handleLogout=()=>{
        logout();
        navigate("/login");
    }
    
    return(
        <div onClick={onClose} className="fixed inset-0">
            {/* User Profile Modal container */}
            <div className="w-72 p-4 rounded-xl shadow-lg absolute top-20 right-6 ">
                <div className='flex items-center gap-2'>
                    <CircleUserRound className='h-8 w-8'/>
                    <h2 className="text-lg font-semibold">Ishita Dutta</h2>
                </div>

                {/* View Profile */}
                <a href="" className='ml-10 underline text-gray-500 text-sm'>View Profile</a>
                <hr className='my-3'/>

                {/* Log out button */}
                <button 
                    className='text-red-500 text-sm hover:cursor-pointer hover:underline'
                    onClick={handleLogout}
                >Log out</button>
                <p className='text-xs text-gray-500'>{user.email}</p>
            </div>
        </div>
    );
}

export default UserProfileModal;
