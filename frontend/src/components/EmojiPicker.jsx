// import React, { useState, useRef, useEffect } from "react";
// import Picker from "@emoji-mart/react";
// import data from "@emoji-mart/data";

// const EmojiPicker = ({ onSelect, onClose }) => {
//   const pickerRef = useRef();

//   const handleSelect = (emoji) => {
//     onSelect(emoji);
//     onClose?.();
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (pickerRef.current && !pickerRef.current.contains(event.target)) {
//         onClose?.();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [onClose]);

//   return (
//     <div className="relative" ref={pickerRef}>
//       <div className="shadow-lg border border-gray-200 rounded-lg bg-white">
//         <Picker
//           data={data}
//           onEmojiSelect={handleSelect}
//           theme="light"
//           previewPosition="none"
//           skinTonePosition="search"
//         />
//       </div>
//     </div>
//   );
// };

// export default EmojiPicker;