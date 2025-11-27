import { CircleUserRound, SendHorizontal } from 'lucide-react'
import { useState, useEffect, useRef } from 'react';

const CommentsModal = ({ comments, onClose }) => {
    const [replyIndex, setReplyIndex] = useState(null);
    const [newComment, setNewComment] = useState("");

    // Close reply box when clicking outside
    const modalRef = useRef(null);

    const replyRef = useRef(null);

    useEffect(() => {
        const handleModalClose = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleModalClose);
        return () => document.removeEventListener("mousedown", handleModalClose);
    }, []);

    useEffect(() => {
        const handleReplyOutside = (e) => {
            if (replyRef.current && !replyRef.current.contains(e.target)) {
                setReplyIndex(null);
            }
        };
        document.addEventListener("mousedown", handleReplyOutside);
        return () => document.removeEventListener("mousedown", handleReplyOutside);
    }, []);

    return (
        <div className="fixed inset-0  flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-gray-100 w-96 p-4 rounded-xl shadow-lg max-h-[80vh] overflow-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold">Comments</h2>
                    <button onClick={onClose} className="text-lg font-bold hover:cursor-pointer">✕</button>
                </div>

                {/* Comments list */}
                {comments.map((comment, index) => (
                    <div 
                        key={index} 
                        className="pb-3 mb-3"
                    >
                        {/* Author section */}
                        <div className="flex items-center gap-1 hover:cursor-pointer">
                            <CircleUserRound className='h-6 w-6'/>
                            <span className='text-sm font-medium'>Ishita Dutta</span>
                        </div>

                        {/* Comment text */}
                        <p className="text-sm mt-1 ml-7">{comment}</p>

                        {/* Action buttons */}
                        <div className="flex items-center gap-4 ml-7 mt-2">
                            <button className="text-xs font-semibold hover:cursor-pointer">Like</button>
                            <button 
                                className="text-xs font-semibold hover:cursor-pointer"
                                onClick={() => setReplyIndex(index === replyIndex ? null : index)}
                            >
                                Reply
                            </button>
                        </div>

                        {/* Reply input */}
                        {replyIndex === index && (
                            <div ref={replyRef} className="relative ml-7 mt-2">
                                <input
                                    type="text"
                                    placeholder="Write a reply..."
                                    className="w-full border rounded-lg px-3 py-1.5 pr-10 text-sm"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <SendHorizontal className="h-5 w-5"/>
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {/* Add new comment */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="w-full border rounded-lg px-3 py-2 pr-10 text-sm"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2">
                        <SendHorizontal className="h-5 w-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentsModal;
