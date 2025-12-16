import { CircleUserRound } from 'lucide-react'

const LikesModal=({users=[], onClose})=>{
    return (
        <>
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40">
                <div className="bg-gray-100 shadow-lg w-80 rounded-xl p-4">
                <div className="flex justify-between mb-3">
                    <h2 className="text-lg font-bold">Liked by</h2>
                    <button onClick={onClose} className='text-lg font-bold hover:cursor-pointer'>✕</button>
                </div>

                {users.length===0 && (
                    <p className="text-sm text-gray-600">No likes yet</p>
                )}

                {users.map((user) => (
                    <div key={user._id} className="flex items-center gap-2 mb-2">

                    {user.profilePic ? (
                        <img
                            src={user.profilePic}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        ) : (
                        <CircleUserRound className="w-8 h-8"/>
                    )}

                    <span className="text-sm">{user.username}</span>
                    </div>
                ))}
                </div>
            </div>
        </>
    );
};

export default LikesModal;
