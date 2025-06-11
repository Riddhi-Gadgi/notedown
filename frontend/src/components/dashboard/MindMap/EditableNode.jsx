import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Handle, Position } from "reactflow";
import { MessageCircle, Plus, X } from "lucide-react";
import Toolbar from "./Toolbar";

const EditableNode = ({ data, id, selected }) => {
  const [label, setLabel] = useState(data.label || "");
  const [activePicker, setActivePicker] = useState(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [mediaError, setMediaError] = useState(false);

  const textRef = useRef(null);
  const commentInputRef = useRef(null);

  const { onNodeDataChange, onToolbarAction, onAddChild } = data;

  const handleChange = useCallback(
    (e) => {
      const newLabel = e.target.value;
      setLabel(newLabel);
      onNodeDataChange(id, { label: newLabel });
    },
    [id, onNodeDataChange]
  );

  const handleToolbarAction = useCallback(
    (action, payload) => {
      const updatedData = { ...data };

      switch (action) {
        case "addConnection":
          onToolbarAction("addConnection", { nodeId: id });
          break;
        case "addComment":
          setShowCommentBox(true);
          setTimeout(() => commentInputRef.current?.focus(), 100);
          break;
        case "addMedia":
          setMediaError(false);
          updatedData.media = payload.imageUrl;
          onNodeDataChange(id, updatedData);
          break;
        case "addLink":
          const newLinks = [
            ...(data.links || []),
            { url: payload.url, title: payload.url },
          ];
          updatedData.links = newLinks;
          onNodeDataChange(id, updatedData);
          break;
        case "addEmoji":
        case "changeEmoji":
          updatedData.emoji = payload.emoji;
          onNodeDataChange(id, updatedData);
          break;
        case "style":
          updatedData.style = payload.style;
          onNodeDataChange(id, updatedData);
          break;
        case "textStyle":
          updatedData.textStyle = payload.textStyle;
          onNodeDataChange(id, updatedData);
          break;
        default:
          onToolbarAction(action, { ...payload, nodeId: id });
      }
    },
    [data, id, onNodeDataChange, onToolbarAction]
  );

  const handleCommentSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (commentText.trim()) {
        const newComment = {
          id: `comment-${Date.now()}`,
          text: commentText.trim(),
          timestamp: Date.now(),
        };
        const updatedComments = [...(data.comments || []), newComment];
        onNodeDataChange(id, { comments: updatedComments });
        setCommentText("");
        setShowCommentBox(false);
      }
    },
    [commentText, data.comments, id, onNodeDataChange]
  );

  const handleDeleteComment = useCallback(
    (commentId) => {
      const updatedComments = (data.comments || []).filter(
        (comment) => comment.id !== commentId
      );
      onNodeDataChange(id, { comments: updatedComments });
    },
    [data.comments, id, onNodeDataChange]
  );

  const getNodeStyleClasses = () => {
    const base = "border-2";

    switch (data.style) {
      case "primary":
        return `${base} bg-blue-600 border-blue-700 text-white`;
      case "secondary":
        return `${base} bg-purple-600 border-purple-700 text-white`;
      case "success":
        return `${base} bg-green-600 border-green-700 text-white`;
      case "warning":
        return `${base} bg-orange-500 border-orange-600 text-white`;
      case "danger":
        return `${base} bg-red-600 border-red-700 text-white`;
      case "highlight":
        return `${base} bg-pink-500 border-pink-600 text-white`;
      case "note":
        return `${base} bg-indigo-600 border-indigo-700 text-white`;
      default:
        return `${base} bg-white border-gray-300 text-gray-900`;
    }
  };

  const getTextStyleClasses = () => {
    const baseColor =
      data.style && data.style !== "default" ? "text-white" : "text-gray-900";

    switch (data.textStyle) {
      case "bold":
        return `font-bold ${baseColor}`;
      case "italic":
        return `italic ${baseColor}`;
      case "underline":
        return `underline ${baseColor}`;
      case "strikethrough":
        return `line-through ${baseColor}`;
      case "code":
        return `font-mono bg-black/20 px-1 rounded text-sm ${baseColor}`;
      case "heading":
        return `text-lg font-bold ${baseColor}`;
      case "subheading":
        return `font-semibold ${baseColor}`;
      default:
        return baseColor;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <>
      {/* Floating Toolbar */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="floating-toolbar"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-[1100]"
            style={{ pointerEvents: "auto" }}
          >
            <Toolbar
              onAction={handleToolbarAction}
              nodeData={data}
              hasEmoji={!!data.emoji}
              isGenerating={data.isGenerating || false}
              activePicker={activePicker}
              setActivePicker={setActivePicker}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Input Box */}
      <AnimatePresence>
        {showCommentBox && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.9 }}
            className="absolute -top-36 left-0 right-0 z-[1000] bg-white rounded-lg shadow-lg border p-2 "
          >
            <form onSubmit={handleCommentSubmit}>
              <input
                ref={commentInputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full text-xs p-2 border rounded focus:ring-1 focus:ring-blue-500/20 focus:border-blue-400"
                placeholder="Add a comment..."
                maxLength={200}
              />
              <div className="flex justify-end gap-1 mt-1 z-1500">
                <button
                  type="button"
                  onClick={() => setShowCommentBox(false)}
                  className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Comments Display */}
      <AnimatePresence>
        {showAllComments && data.comments && data.comments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.9 }}
            className="absolute -top-36 left-0 right-0 z-[2000] bg-white rounded-lg shadow-lg border p-2 max-h-48 overflow-y-auto"
            style={{ transform: "translateY(-100%)" }}
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-medium text-gray-700">
                ({data.comments.length})
              </h4>
              <button
                onClick={() => setShowAllComments(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1">
              {data.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 rounded p-1 group"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-gray-800 flex-1">
                      {comment.text}
                    </p>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 ml-1 transition-opacity"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {formatTimestamp(comment.timestamp)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Node */}
      <motion.div
        className={`relative rounded-xl transition-all duration-300 ${getNodeStyleClasses()} ${
          data.isGenerating ? "opacity-70" : ""
        } ${selected ? "shadow-xl scale-105" : "shadow-md hover:shadow-lg"}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        whileHover={{
          scale: selected ? 1.05 : 1.02,
          transition: { duration: 0.2 },
        }}
        style={{
          padding: data.emoji ? "1.2rem 0.8rem 0.8rem" : "0.8rem",
          minWidth: "180px",
          maxWidth: "320px",
          zIndex: selected ? 1000 : "auto",
        }}
      >
        {/* Emoji */}
        <AnimatePresence>
          {data.emoji && (
            <motion.div
              key="node-emoji"
              initial={{ opacity: 0, y: -10, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.5 }}
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xl bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md border border-gray-100"
            >
              {data.emoji}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media */}
        {data.media && !mediaError && (
          <motion.div
            className="w-full mb-2 overflow-hidden rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <img
              src={data.media}
              alt="Node media"
              className="w-full h-auto max-h-20 object-cover rounded-lg"
              onError={() => setMediaError(true)}
              loading="lazy"
            />
          </motion.div>
        )}

        {/* Links */}
        {data.links && data.links.length > 0 && (
          <motion.div
            className="mb-2 space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            {data.links.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-1.5 bg-black/10 border border-white/20 rounded-lg hover:bg-black/20 transition-all group"
              >
                <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${link.url}`}
                    alt="favicon"
                    className="w-3 h-3"
                  />
                </div>
                <div className="truncate text-xs group-hover:underline">
                  {new URL(link.url).hostname.replace("www.", "")}
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* React Flow Handles */}
        {selected && (
          <>
            <Handle
              type="target"
              position={Position.Top}
              className="!w-2 !h-2 !bg-blue-500 !border-2 !border-white !shadow-md"
            />
            <Handle
              type="source"
              position={Position.Bottom}
              className="!w-2 !h-2 !bg-blue-500 !border-2 !border-white !shadow-md"
            />
            <Handle
              type="source"
              position={Position.Left}
              className="!w-2 !h-2 !bg-blue-500 !border-2 !border-white !shadow-md"
            />
            <Handle
              type="source"
              position={Position.Right}
              className="!w-2 !h-2 !bg-blue-500 !border-2 !border-white !shadow-md"
            />
          </>
        )}

        {/* Main Text Area */}
        <div className="relative">
          <textarea
            ref={textRef}
            value={label}
            onChange={handleChange}
            className={`w-full text-center text-sm resize-none focus:outline-none overflow-hidden ${getTextStyleClasses()} bg-transparent placeholder-gray-400`}
            style={{
              minHeight: "1.2rem",
              lineHeight: "1.4",
              padding: "0.3rem 0",
            }}
            rows={1}
            maxLength={500}
            disabled={data.isGenerating}
            placeholder="Type something..."
            onInput={(e) => {
              const target = e.target;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
        </div>

        {/* Comments Indicator */}
        {data.comments && data.comments.length > 0 && (
          <motion.button
            className="absolute top-1 right-1 bg-white/90 text-gray-700 px-1.5 py-0.5 rounded-full text-xs flex items-center gap-1 shadow-md hover:bg-white transition-colors"
            onClick={() => setShowAllComments(!showAllComments)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-2.5 h-2.5" />
            {data.comments.length}
          </motion.button>
        )}

        {/* Add Child Button */}
        {selected && (
          <motion.button
            onClick={() => onAddChild(id)}
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-6 h-6 rounded-full shadow-md flex items-center justify-center hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Plus className="w-3 h-3" />
          </motion.button>
        )}

        {/* Loading Animation */}
        {data.isGenerating && (
          <motion.div
            className="absolute inset-0 bg-white/50 rounded-xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default React.memo(EditableNode);
