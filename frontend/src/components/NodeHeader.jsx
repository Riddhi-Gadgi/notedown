// NodeHeader.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import EmojiPicker from "./EmojiPicker";
import StylePicker from "./StylePicker";
import TextStylePicker from "./TextStylePicker";

const NodeHeader = ({ 
  emoji, 
  onEmojiSelect, 
  onStyleChange, 
  onTextStyleChange,
  currentStyle,
  currentTextStyle
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [showTextStylePicker, setShowTextStylePicker] = useState(false);
  
  const emojiPickerRef = useRef();
  const stylePickerRef = useRef();
  const textStylePickerRef = useRef();

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowStylePicker(false);
    setShowTextStylePicker(false);
  };

  const toggleStylePicker = () => {
    setShowStylePicker(!showStylePicker);
    setShowEmojiPicker(false);
    setShowTextStylePicker(false);
  };

  const toggleTextStylePicker = () => {
    setShowTextStylePicker(!showTextStylePicker);
    setShowEmojiPicker(false);
    setShowStylePicker(false);
  };

  return (
    <div className="relative flex items-center justify-between mb-2">
      <div className="flex items-center">
        <div className="relative" ref={emojiPickerRef}>
          <button
            onClick={toggleEmojiPicker}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            {emoji ? (
              <span className="text-xl">{emoji}</span>
            ) : (
              <img 
                src="/icons/add-emoji.svg" 
                alt="Add Emoji" 
                className="w-4 h-4 opacity-70"
              />
            )}
          </button>
          
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-10 left-0 z-50"
            >
              <EmojiPicker onSelect={handleEmojiSelect} />
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <div className="relative" ref={stylePickerRef}>
          <button
            onClick={toggleStylePicker}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <img 
              src="/icons/style.svg" 
              alt="Style" 
              className="w-4 h-4 opacity-70"
            />
          </button>
          
          {showStylePicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-10 right-0 z-50"
            >
              <StylePicker 
                currentStyle={currentStyle}
                onChange={onStyleChange} 
              />
            </motion.div>
          )}
        </div>

        <div className="relative" ref={textStylePickerRef}>
          <button
            onClick={toggleTextStylePicker}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <img 
              src="/icons/text-style.svg" 
              alt="Text Style" 
              className="w-4 h-4 opacity-70"
            />
          </button>
          
          {showTextStylePicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-10 right-0 z-50"
            >
              <TextStylePicker 
                currentTextStyle={currentTextStyle}
                onChange={onTextStyleChange} 
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeHeader;