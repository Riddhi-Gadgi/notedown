import React, { useRef, useEffect, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link,
  MessageCircle,
  Image,
  Smile,
  Palette,
  Type,
  MoreHorizontal,
  Copy,
  Clipboard,
  Layers,
  Trash2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  GitBranch,
} from "lucide-react";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

const toolbarItems = [
  {
    name: "Add Connection",
    icon: GitBranch,
    action: "addConnection",
  },
  {
    name: "Add Comment",
    icon: MessageCircle,
    action: "addComment",
  },
  {
    name: "Add Media",
    icon: Image,
    action: "addMedia",
  },
  {
    name: "Add Link",
    icon: Link,
    action: "addLink",
  },
  {
    name: "Add Emoji",
    icon: Smile,
    action: "addEmoji",
    picker: "emoji",
  },
  {
    name: "Style",
    icon: Palette,
    action: "style",
    picker: "style",
  },
  {
    name: "Text Style",
    icon: Type,
    action: "textStyle",
    picker: "textStyle",
  },
];

const moreItems = [
  { name: "Copy", icon: Copy, action: "copyNode" },
  { name: "Paste", icon: Clipboard, action: "pasteNode" },
  { name: "Duplicate", icon: Layers, action: "duplicateNode" },
  { name: "Delete", icon: Trash2, action: "deleteNode" },
];

const styleOptions = [
  { value: "default", label: "Default", color: "bg-white border-gray-300" },
  { value: "primary", label: "Primary", color: "bg-blue-600" },
  { value: "secondary", label: "Secondary", color: "bg-purple-600" },
  { value: "success", label: "Success", color: "bg-green-600" },
  { value: "warning", label: "Warning", color: "bg-orange-500" },
  { value: "danger", label: "Danger", color: "bg-red-600" },
  { value: "highlight", label: "Highlight", color: "bg-pink-500" },
  { value: "note", label: "Note", color: "bg-indigo-600" },
];

const textStyleOptions = [
  { value: "normal", label: "Normal", icon: Type },
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
  { value: "strikethrough", label: "Strikethrough", icon: Strikethrough },
  { value: "code", label: "Code", icon: Code },
  { value: "heading", label: "Heading", icon: Heading1 },
  { value: "subheading", label: "Subheading", icon: Heading2 },
];

const Toolbar = ({
  onAction,
  hasEmoji,
  nodeData,
  isGenerating,
  activePicker,
  setActivePicker,
}) => {
  const [linkInput, setLinkInput] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const wrapperRef = useRef(null);
  const fileRef = useRef(null);
  const linkInputRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setActivePicker(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setActivePicker]);

  const handleClick = (action, picker) => {
    if (isGenerating) return;

    if (action === "addMedia") {
      fileRef.current?.click();
    } else if (action === "addLink") {
      setActivePicker(activePicker === "link" ? null : "link");
      setTimeout(() => linkInputRef.current?.focus(), 0);
    } else if (picker) {
      setActivePicker(activePicker === picker ? null : picker);
    } else {
      onAction(action);
      setActivePicker(null);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () =>
        onAction("addMedia", { imageUrl: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    let url = linkInput.trim();
    if (url && !url.startsWith("http")) url = `https://${url}`;
    onAction("addLink", { url });
    setLinkInput("");
    setActivePicker(null);
  };

  const renderPicker = () => {
    if (!activePicker) return null;

    const pickerVariants = {
      hidden: { opacity: 0, scale: 0.95, y: 10 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: { duration: 0.15 },
      },
    };

    const pickerPosition = "absolute bottom-full left-0 mb-2 z-[1100]";

    switch (activePicker) {
      case "emoji":
        return (
          <motion.div
            variants={pickerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${pickerPosition} bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm`}
          >
            <div className="flex items-center text-xs font-medium text-gray-700 px-2 py-1 border-b bg-gray-50/80">
              <Smile className="w-3 h-3 mr-1" />
              Emoji
            </div>
            <div className="max-h-[180px] overflow-auto">
              <Suspense
                fallback={
                  <div className="w-[240px] h-[180px] flex items-center justify-center text-gray-500 text-xs">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                    />
                  </div>
                }
              >
                <EmojiPicker
                  width={240}
                  height={160}
                  previewConfig={{ showPreview: false }}
                  searchDisabled={true}
                  skinTonePickerLocation="PREVIEW"
                  onEmojiClick={(data) => {
                    if (!isGenerating) {
                      onAction(hasEmoji ? "changeEmoji" : "addEmoji", {
                        emoji: data.emoji,
                      });
                      setActivePicker(null);
                    }
                  }}
                />
              </Suspense>
            </div>
          </motion.div>
        );

      case "link":
        return (
          <motion.div
            variants={pickerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${pickerPosition} bg-white rounded-lg shadow-xl border border-gray-100 w-60 p-3 backdrop-blur-sm`}
          >
            <div className="flex items-center text-xs font-medium text-gray-700 mb-2">
              <Link className="w-3 h-3 mr-1 text-blue-500" />
              Add Link
            </div>
            <form onSubmit={handleLinkSubmit}>
              <input
                ref={linkInputRef}
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                className="text-xs p-2 border border-gray-200 rounded-lg w-full mb-2 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="https://example.com"
              />
              <div className="flex justify-end gap-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setActivePicker(null)}
                  className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors shadow-md"
                >
                  Add Link
                </motion.button>
              </div>
            </form>
          </motion.div>
        );

      case "style":
        return (
          <motion.div
            variants={pickerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${pickerPosition} bg-white shadow-xl rounded-lg p-3 w-48 backdrop-blur-sm border border-gray-100`}
          >
            <div className="flex items-center text-xs font-medium text-gray-700 mb-2">
              <Palette className="w-3 h-3 mr-1 text-purple-500" />
              Node Style
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {styleOptions.map((style) => (
                <motion.button
                  key={style.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onAction("style", { style: style.value });
                    setActivePicker(null);
                  }}
                  className={`flex flex-col items-center p-1.5 rounded-lg hover:bg-gray-50 transition-all ${
                    nodeData.style === style.value
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "ring-1 ring-gray-200"
                  }`}
                  title={style.label}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${style.color} mb-1 shadow-sm`}
                  />
                  <span className="text-[9px] text-gray-600 truncate w-full text-center">
                    {style.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case "textStyle":
        return (
          <motion.div
            variants={pickerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${pickerPosition} bg-white shadow-xl rounded-lg p-3 w-44 backdrop-blur-sm border border-gray-100`}
          >
            <div className="flex items-center text-xs font-medium text-gray-700 mb-2">
              <Type className="w-3 h-3 mr-1 text-green-500" />
              Text Style
            </div>
            <div className="grid grid-cols-2 gap-1">
              {textStyleOptions.map((style) => {
                const IconComponent = style.icon;
                return (
                  <motion.button
                    key={style.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onAction("textStyle", { textStyle: style.value });
                      setActivePicker(null);
                    }}
                    className={`flex items-center p-1.5 rounded-lg text-xs hover:bg-gray-50 transition-all ${
                      nodeData.textStyle === style.value
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                        : "text-gray-700"
                    }`}
                  >
                    <IconComponent className="w-3 h-3 mr-1.5" />
                    <span className="truncate text-[10px]">{style.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );

      case "more":
        return (
          <motion.div
            variants={pickerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${pickerPosition} right-0 left-auto bg-white shadow-xl rounded-lg p-1.5 w-36 backdrop-blur-sm border border-gray-100`}
          >
            <div className="text-xs font-medium text-gray-700 px-2 py-1 border-b mb-1">
              More Actions
            </div>
            {moreItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.action}
                  whileHover={{ backgroundColor: "#f9fafb", scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onAction(item.action);
                    setActivePicker(null);
                  }}
                  className="flex items-center w-full px-2 py-1.5 text-xs rounded transition-all text-gray-700"
                  disabled={isGenerating}
                >
                  <IconComponent className="w-3 h-3 mr-2" />
                  {item.name}
                </motion.button>
              );
            })}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={wrapperRef} className="relative z-[1100]">
      <input
        type="file"
        ref={fileRef}
        className="hidden"
        accept="image/*"
        onChange={handleFile}
      />

      <motion.div
        className="flex bg-white/95 backdrop-blur-md p-1 space-x-0.5 shadow-lg rounded-lg border border-gray-200/50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {toolbarItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.name} className="relative">
              <motion.button
                disabled={isGenerating}
                onClick={() => handleClick(item.action, item.picker)}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-6 h-6 flex items-center justify-center rounded-lg relative transition-all ${
                  activePicker === item.picker
                    ? "bg-blue-50 ring-2 ring-blue-200 text-blue-600"
                    : "hover:bg-gray-100 text-gray-600"
                } ${isGenerating ? "opacity-50" : ""}`}
                title={item.name}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </motion.button>

              {/* Small Black Tooltip */}
              <AnimatePresence>
                {hoveredItem === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-black text-white text-[10px] rounded whitespace-nowrap z-[1200]"
                  >
                    {item.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="relative">
          <motion.button
            disabled={isGenerating}
            onClick={() =>
              setActivePicker(activePicker === "more" ? null : "more")
            }
            onMouseEnter={() => setHoveredItem("More")}
            onMouseLeave={() => setHoveredItem(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all ${
              activePicker === "more"
                ? "bg-blue-50 ring-2 ring-blue-200 text-blue-600"
                : "hover:bg-gray-100 text-gray-600"
            } ${isGenerating ? "opacity-50" : ""}`}
            title="More Actions"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </motion.button>

          {/* Tooltip for More button */}
          <AnimatePresence>
            {hoveredItem === "More" && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-black text-white text-[10px] rounded whitespace-nowrap z-[1200]"
              >
                More
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>{renderPicker()}</AnimatePresence>
    </div>
  );
};

export default Toolbar;
