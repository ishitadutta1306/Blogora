import { CircleUserRound, SendHorizontal } from 'lucide-react'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CommentsModal=({ postId, onClose, onCommentAdded })=>{
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment]=useState("");

    const [replyIndex, setReplyIndex]=useState(null);
    const [replyText, setReplyText] = useState("");

    const token = localStorage.getItem("token");

    // Close modal box when clicking outside
    const modalRef=useRef(null);
    const replyRef=useRef(null);
    useEffect(() => {
        const handleModalClose=(e)=>{
            if (modalRef.current && !modalRef.current.contains(e.target)){
                onClose();
            }
        };
        document.addEventListener("mousedown", handleModalClose);
        return () => document.removeEventListener("mousedown", handleModalClose);
    }, []);

    // Close reply box when clicking outside
    useEffect(() => {
        const handleReplyOutside=(e)=>{
            if (replyRef.current && !replyRef.current.contains(e.target)){
                setReplyIndex(null);
            }
        };
        document.addEventListener("mousedown", handleReplyOutside);
        return () => document.removeEventListener("mousedown", handleReplyOutside);
    }, []);

    //Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/comments/${postId}`)  //<-fix!
                setComments(res.data)
            } 
            catch (err) {
                console.error("Fetch comments failed", err)
            }
        }
        fetchComments();
    }, [postId]);

    //Add comment
    const handleAddComment=async()=>{
        if (!newComment.trim()){
            return;
        }

        try {
            const res=await axios.post(`http://localhost:5000/api/comments`,  //<- fix route
                {
                    post: postId,  
                    content: newComment
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            //Update comments list in modal
            setComments(prev => [res.data, ...prev]);

            //Notify parent (BlogCard / BlogPage)
            onCommentAdded?.();

            //Clear input
            setNewComment("");
        } 
        catch (err) {
            console.error("Add comment failed", err)
        }
    }

    //Add reply
    const handleReply=async(commentId)=>{
        if (!replyText.trim()){
            return;
        } 

        try {
            const res = await axios.post(`http://localhost:5000/api/comments/reply/${commentId}`, //<-fix route
                { content: replyText },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setComments(prev => [res.data, ...prev]);
            onCommentAdded?.();
            setReplyIndex(null);
            setReplyText("");
        }
        catch (err) {
            console.error("Reply failed", err)
        }
    }

    return (
        <div className="fixed inset-0  flex justify-center items-center z-50 bg-black/40">
            <div ref={modalRef} className="bg-gray-100 w-96 p-4 rounded-xl shadow-lg max-h-[80vh] overflow-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold">Comments</h2>
                    <button onClick={onClose} className="text-lg font-bold hover:cursor-pointer">✕</button>
                </div>

                {/* Comments list */}
                {comments.length===0 && (
                    <p className="text-sm text-gray-600 mb-3">No comments yet</p>
                )}

                {comments.map((comment, index) => (
                    <div key={comment._id} className="pb-3 mb-3">
                        {/* Author section */}
                        <div className="flex items-center gap-1 hover:cursor-pointer">
                            <CircleUserRound className='h-6 w-6'/>
                            <span className='text-sm font-medium'>{comment.user?.username}</span>
                        </div>

                        {/* Comment text */}
                        <p className="text-sm mt-1 ml-7">{comment.content}</p>

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
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full border rounded-lg px-3 py-1.5 pr-10 text-sm"
                                />
                                <button 
                                    onClick={() => handleReply(comment._id)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <SendHorizontal onClick={handleAddComment} className="h-5 w-5 hover:cursor-pointer"/>
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
                    <button 
                        onClick={handleAddComment} 
                        className="absolute right-2 top-1/2 -translate-y-1/2">
                            <SendHorizontal className="h-5 w-5 hover:cursor-pointer"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentsModal;
