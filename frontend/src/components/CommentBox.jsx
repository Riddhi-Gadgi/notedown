import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CommentBox = ({ comments, onAddComment, onClose }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment({
        text: newComment,
        date: new Date().toISOString()
      });
      setNewComment("");
    }
  };

  return (
    <motion.div 
      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Comments ({comments.length})</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        
        <div className="max-h-40 overflow-y-auto mb-3 space-y-2">
          {comments.map((comment, i) => (
            <div key={i} className="text-sm p-2 bg-gray-50 rounded">
              <p>{comment.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(comment.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="flex">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-3 rounded-r hover:bg-blue-600"
          >
            Add
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CommentBox;