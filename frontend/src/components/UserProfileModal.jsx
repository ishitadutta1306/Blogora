import { CircleUserRound } from 'lucide-react'

const UserProfileModal=({isOpen, onClose})=>{
    if (!isOpen){
        return null;
    }

    const user={
        name: "Ishita Dutta",
        email: "ishitadutta@gmail.com"
    }
    
    return(
        <div onClick={onClose} className="fixed inset-0">
            {/* User Profile Modal container */}
            <div className="w-72 p-4 rounded-xl shadow-lg absolute top-20 right-6 ">
                <div className='flex items-center gap-2'>
                    <CircleUserRound className='h-8 w-8'/>
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                </div>

                {/* View Profile */}
                <a href="" className='ml-10 underline text-gray-500 text-sm'>View Profile</a>
                <hr className='my-3'/>

                {/* Log out button */}
                <button className='text-red-500 text-sm hover:cursor-pointer hover:underline'>Log out</button>
                <p className='text-xs text-gray-500'>{user.email}</p>
            </div>
        </div>
    );
}

export default UserProfileModal;
