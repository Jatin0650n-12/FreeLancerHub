import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, MessageCircle, Share2, Briefcase, Heart, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { likePost, addComment } from "../services/api";
import { socket } from "../services/socket";
import { formatDistanceToNow } from "date-fns";

const renderWithHashtags = (text) => {
  if (!text) return null;
  const parts = text.split(/(#\w+)/g);
  return parts.map((part, index) => {
    if (part.startsWith("#")) {
      const tag = part.substring(1);
      return (
        <Link
          key={index}
          to={`/search?q=${tag}`}
          className="text-blue-600 font-semibold hover:underline"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
};

const formatTimestamp = (timestamp) => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (e) {
    return "just now";
  }
};

const PostCard = ({ post }) => {
  const { author, content, postType, createdAt, _id, project } = post;
  const { user } = useAuth();

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(2);

  useEffect(() => {
    setIsLiked(likes.includes(user?._id));
  }, [likes, user?._id]);

  useEffect(() => {
    const handleLikeUpdate = ({ postId, likes: updatedLikes }) => {
      if (postId === _id) setLikes(updatedLikes);
    };
    const handleCommentUpdate = ({ postId, comment: newCommentItem }) => {
      if (postId === _id) {
        setComments((prevComments) => [newCommentItem, ...prevComments]);
        setVisibleCommentsCount((prevCount) => prevCount + 1);
      }
    };

    socket.on("postLikeUpdate", handleLikeUpdate);
    socket.on("postCommentUpdate", handleCommentUpdate);

    return () => {
      socket.off("postLikeUpdate", handleLikeUpdate);
      socket.off("postCommentUpdate", handleCommentUpdate);
    };
  }, [_id]);

  const handleLike = async () => {
    const originalLikes = likes;
    const newLikes = isLiked
      ? likes.filter((id) => id !== user._id)
      : [...likes, user._id];

    setIsLiked(!isLiked);
    setLikes(newLikes);

    try {
      await likePost(_id);
    } catch (error) {
      console.error("Failed to update like status:", error);
      setIsLiked(!isLiked);
      setLikes(originalLikes);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addComment(_id, { text: newComment.trim() });
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const renderContent = () => {
    switch (postType) {
      case "job":
        return (
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 my-2 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">{content.jobTitle}</h3>
              {content.jobBudget && (
                <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs border border-emerald-200">
                  ₹{Number(content.jobBudget).toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
              {content.jobDescription}
            </p>
            {project && (
              <div className="pt-2">
                <Link
                  to={`/project/${project}`}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-xs transition-colors"
                >
                  <Briefcase size={14} />
                  <span>View Project & Submit Bid</span>
                </Link>
              </div>
            )}
          </div>
        );
      case "showcase":
        return (
          <div>
            <p className="mb-2 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
              {renderWithHashtags(content.text)}
            </p>
            {content.imageUrl && (
              <img
                src={content.imageUrl}
                alt="Showcase Deliverable"
                className="mt-2 rounded-2xl w-full object-cover max-h-96 border border-slate-100"
              />
            )}
          </div>
        );
      case "text":
      default:
        return (
          <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
            {renderWithHashtags(content.text)}
          </p>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 mb-5 shadow-xs hover:border-slate-300 transition-all">
      {/* Author Header */}
      <div className="flex items-center justify-between mb-4">
        <Link to={`/profile/${author?._id}`} className="flex items-center gap-3 group">
          {author?.profilePictureUrl ? (
            <img
              src={author.profilePictureUrl}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
              {author?.name?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {author?.name}
              </p>
              {author?.role && (
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {author.role}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatTimestamp(createdAt)}
            </p>
          </div>
        </Link>
      </div>

      {/* Post Content */}
      <div className="mb-4">{renderContent()}</div>

      {/* Action Buttons */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer ${
            isLiked ? "text-rose-600 bg-rose-50/70" : "text-slate-600"
          }`}
        >
          <Heart size={16} className={isLiked ? "fill-rose-600 text-rose-600" : ""} />
          <span>{likes.length} {likes.length === 1 ? "Like" : "Likes"}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
        >
          <MessageCircle size={16} />
          <span>{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</span>
        </button>

        <button
          onClick={() => {
            navigator.clipboard?.writeText?.(window.location.href);
            toast?.info?.("Link copied to clipboard!");
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="border-t border-slate-100 mt-3 pt-4 space-y-4">
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2.5">
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-600 flex-shrink-0">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a constructive comment..."
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-full transition-colors cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>

          {/* Comment list */}
          <div className="space-y-3 pt-1">
            {comments.slice(0, visibleCommentsCount).map((comment) => (
              <div key={comment._id} className="flex items-start gap-2.5">
                {comment.author?.profilePictureUrl ? (
                  <img
                    src={comment.author.profilePictureUrl}
                    alt={comment.author.name}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex-shrink-0 items-center justify-center flex font-bold text-[10px] text-slate-600 mt-0.5">
                    {comment.author?.name?.charAt(0) || "?"}
                  </div>
                )}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3.5 py-2 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-bold text-xs text-slate-900">
                      {comment.author?.name || "Member"}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {formatTimestamp(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {comments.length > visibleCommentsCount && (
            <button
              onClick={() => setVisibleCommentsCount(comments.length)}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              View all {comments.length} comments
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
