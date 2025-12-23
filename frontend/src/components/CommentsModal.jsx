import { CircleUserRound, Ellipsis, SendHorizontal } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CommentsModal=({ postId, onClose, onCommentAdded })=>{
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment]=useState("");

    const [replyIndex, setReplyIndex]=useState(null);
    const [replyText, setReplyText] = useState("");

    const token = localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split(".")[1])).id; 

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

    //Build nested comment tree
    const buildCommentTree = (comments) => {
        const map = {};
        const roots = [];

        comments.forEach(c => {
            map[c._id] = { ...c, replies: [] };
        });

        comments.forEach(c => {
            if (c.parentComment !== null && c.parentComment !== undefined){
                const parentId = typeof c.parentComment === "object" ? c.parentComment._id : c.parentComment;
                map[parentId]?.replies.push(map[c._id]);
            } 
            else {
                roots.push(map[c._id]);
            }
        });

        return roots;
    };

    const nestedComments = buildCommentTree(comments);

    //Recursive render of comments
    const renderComment=(comment, level =0) => (
        <div key={comment._id} className="pb-3 mb-3" style={{ marginLeft: level * 16 }}>
            {/* Author */}
            <div className="flex items-center gap-2">
                {/* Author */}
                <CircleUserRound className="h-6 w-6" />
                <span className="text-sm font-medium">{comment.user?.username}</span>

                {/* Date */}
                <span className="text-xs text-gray-600">
                    {formatTimeAgo(comment.createdAt)}
                </span>
            </div>

            {/* Content */}
            <p className="text-sm mt-1 ml-7">{comment.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 ml-7 mt-2">
                <button
                    className="text-xs font-semibold hover:cursor-pointer"
                    onClick={() => setReplyIndex(comment._id)}
                >
                    Reply
                </button>
                
                {comment.user?._id === userId && (
                    <button
                        className="text-xs text-red-500 font-semibold"
                        onClick={() => handleDelete(comment._id)}
                    >
                        Delete
                    </button>
                )}
            </div>

            {/* Reply box */}
            {replyIndex === comment._id && (
                <div ref={replyRef} className="relative ml-7 mt-2">
                    <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "comment")}
                        placeholder="Write a reply..."
                        className="w-full border rounded-lg px-3 py-1.5 pr-10 text-sm"
                    />
                    <button
                        onClick={() => handleReply(comment._id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                        <SendHorizontal className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* 🔹 Render replies recursively */}
            {comment.replies.length > 0 && (
                <div className="mt-4">
                    {comment.replies.map(reply => renderComment(reply, level + 1))}
                </div>
            )}
        </div>
    );

    // Delete comment
    const handleDelete=async (commentId) => {
        try {
            await axios.delete(`http://localhost:5000/api/comments/${commentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            //Remove from UI
            setComments(prev => prev.filter(c => c._id !== commentId));
            onCommentAdded?.();
        }
        catch (err) {
            console.error("Delete failed", err);
        }
    };

    //display time user beside their username
    const formatTimeAgo=(date) => {
        const seconds=Math.floor((Date.now() - new Date(date)) / 1000);

        if (seconds<3600) return `${Math.floor(seconds/60)}m`;
        if (seconds<86400) return `${Math.floor(seconds/3600)}h`;
        if (seconds<604800) return `${Math.floor(seconds/86400)}d`;

        return `${Math.floor(seconds/604800)}wk`;
    };

    //press enter to send comment
    const handleKeyDown = (e, type, id = null) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            type === "comment"
                ? handleAddComment()
                : handleReply(id);
        }
    };

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

                {nestedComments.map(comment => renderComment(comment))}

                {/* Add new comment */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="w-full border rounded-lg px-3 py-2 pr-10 text-sm"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "comment")}
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
