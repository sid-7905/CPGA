import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ThumbsUp, ThumbsDown, MessageCircle, User } from 'lucide-react';
import { showErrorToast, showSuccessToast } from '../toastify';
import { NavLink } from 'react-router-dom';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DiscussionCard = ({ discussion, onUpdate }) => {
    const [comment, setComment] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/discussions/${discussion._id}/comments`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.data.status === "success") {
                setComments(response.data.comments);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            showErrorToast("Error fetching comments");
        }
    };

    useEffect(() => {
            fetchComments();
    }, [showComments, discussion._id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            return showErrorToast("Comment cannot be empty");
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/discussions/${discussion._id}/comment`,
                { content: comment },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.data.status === "success") {
                setComment("");
                fetchComments();
                showSuccessToast("Comment added successfully");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            showErrorToast("Error adding comment");
        }
    };

    const handleLike = async () => {
        try {
            await axios.post(
                `${backendUrl}/api/discussions/${discussion._id}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            onUpdate();
        } catch (error) {
            console.error("Error liking discussion:", error);
            showErrorToast("Error liking discussion");
        }
    };

    const handleDislike = async () => {
        try {
            await axios.post(
                `${backendUrl}/api/discussions/${discussion._id}/dislike`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            onUpdate();
        } catch (error) {
            console.error("Error disliking discussion:", error);
            showErrorToast("Error disliking discussion");
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            await axios.post(
                `${backendUrl}/api/discussions/${discussion._id}/comments/${commentId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            fetchComments();
        } catch (error) {
            console.error("Error liking comment:", error);
            showErrorToast("Error liking comment");
        }
    };

    const handleCommentDislike = async (commentId) => {
        try {
            await axios.post(
                `${backendUrl}/api/discussions/${discussion._id}/comments/${commentId}/dislike`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            fetchComments();
        } catch (error) {
            console.error("Error disliking comment:", error);
            showErrorToast("Error disliking comment");
        }
    };

    return (
        <div className="border border-gray-700/50 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg">
            {/* Discussion Header */}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
                    {discussion?.author?.image ? (
                        <NavLink 
                        to={`/profile/${discussion.author._id}`}>
                            <img
                                src={discussion.author.image}
                                alt="Profile"
                                className="h-full w-full rounded-full object-cover"
                            />
                        </NavLink>
                    ) : (
                        <User className="h-full w-full p-1 text-gray-400 object-cover" />
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-200">{discussion.title}</h3>
                    <p className="text-sm text-gray-400">
                        Posted by <NavLink 
                        className={`hover:text-cyan-400 transition-all`}
                        to={`/profile/${discussion.author._id}`}>
                           {discussion.author.name}
                        </NavLink> •{" "}
                        {new Date(discussion.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Discussion Content */}
            <p className="text-gray-300 mb-4">{discussion.content}</p>

            {/* Tags */}
            {Array.isArray(discussion.tags) && discussion.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {discussion.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleLike}
                    className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-all"
                >
                    {discussion.likes.includes(JSON.parse(localStorage.getItem("user")).id) ? (
                        <ThumbsUp size={16} fill="currentColor" />
                    ) : (
                        <ThumbsUp size={16} />
                    )}
                    {discussion.likes.length}
                </button>
                <button
                    onClick={handleDislike}
                    className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-all"
                >
                    {discussion.dislikes.includes(JSON.parse(localStorage.getItem("user")).id) ? (
                        <ThumbsDown size={16} fill="currentColor" />
                    ) : (
                        <ThumbsDown size={16} />
                    )}
                    {discussion.dislikes.length}
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-all"
                >
                    <MessageCircle size={16} />
                    {comments.length} Comments
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-6">
                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="flex flex-wrap gap-2 mb-4">
                        <input
                            className="flex-1 p-2 border border-gray-700/50 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                            Comment
                        </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                            {comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="flex items-start gap-4 p-4 bg-gray-700 rounded-lg"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden shadow-lg">
                                        {comment?.author?.image ? (
                                            <img
                                                src={comment.author.image}
                                                alt="Profile"
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-full w-full p-1 text-gray-400 object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-200">{comment?.author?.name}</p>
                                        <p className="text-gray-300">{comment?.content}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => handleCommentLike(comment._id)}
                                                className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-all"
                                            >
                                                {comment?.likes?.includes(JSON.parse(localStorage.getItem("user")).id) ? (
                                                    <ThumbsUp size={16} fill="currentColor" />
                                                ) : (
                                                    <ThumbsUp size={16} />
                                                )}
                                                {comment?.likes?.length}
                                            </button>
                                            <button
                                                onClick={() => handleCommentDislike(comment._id)}
                                                className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-all"
                                            >
                                                {comment?.dislikes?.includes(JSON.parse(localStorage.getItem("user")).id) ? (
                                                    <ThumbsDown size={16} fill="currentColor" />
                                                ) : (
                                                    <ThumbsDown size={16} />
                                                )}
                                                {comment?.dislikes?.length}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscussionCard;