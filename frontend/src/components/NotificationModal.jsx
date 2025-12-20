import { CircleUserRound } from 'lucide-react'

const NotificationModal=({isOpen, onClose})=>{
    if (!isOpen){
        return null;
    }
    
    const notifications=[
        {
            id: 1,
            text: "${user} liked your post",
            date: "Nov 22",
            timeAgo: "5m",
        },
        {
            id: 2,
            text: "${user} started following you",
            date: "Nov 21",
            timeAgo: "1d",
        },
    ];

    return(
        <div onClick={onClose} className='fixed inset-0'>
            {/* Notification Modal */} 
            <div onClick={(e)=>e.stopPropagation()} className='bg-white w-72 p-4 rounded-xl shadow-lg absolute top-20 right-6'>
                <h2 className='text-lg font-semibold mb-3'>Notifications</h2>
                {/* Notifications list */}
                <div className='space-y-3'>
                    {notifications.map(n=>(
                        //Notification container
                        <div key={n.id} className='flex items-center gap-2 pb-2'>
                            <CircleUserRound className='h-8 w-8'/>

                            {/* Notification */}
                            <div className='flex items-center text-sm gap-2'>
                                <span>{n.text}</span>
                                <span className='text-gray-500 text-xs'>{n.timeAgo}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NotificationModal;
