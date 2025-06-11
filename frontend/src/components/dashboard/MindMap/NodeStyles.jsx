const NodeStyles = {
  getNodeClass: (style, selected) => {
    const base = "border shadow-sm";
    let styleClass = "";
    
    switch (style) {
      case "primary": styleClass = "bg-blue-500 border-blue-600 text-white"; break;
      case "secondary": styleClass = "bg-purple-500 border-purple-600 text-white"; break;
      case "success": styleClass = "bg-green-500 border-green-600 text-white"; break;
      case "warning": styleClass = "bg-yellow-500 border-yellow-600 text-gray-800"; break;
      case "danger": styleClass = "bg-red-500 border-red-600 text-white"; break;
      case "highlight": styleClass = "bg-amber-500 border-amber-600 text-white"; break;
      case "note": styleClass = "bg-indigo-500 border-indigo-600 text-white"; break;
      default: styleClass = "bg-white border-gray-300 text-gray-800"; break;
    }
    
    return `${base} ${styleClass} ${selected ? "ring-2 ring-blue-400" : ""}`;
  },
  
  getTextClass: (textStyle) => {
    switch (textStyle) {
      case "bold": return "font-bold";
      case "italic": return "italic";
      case "underline": return "underline";
      case "strikethrough": return "line-through";
      case "code": return "font-mono bg-gray-100 px-1 rounded text-sm";
      case "heading": return "text-lg font-bold";
      case "subheading": return "font-medium";
      default: return "";
    }
  },
  
  getMiniMapColor: (style) => {
    switch (style) {
      case "primary": return "#3b82f6";
      case "secondary": return "#8b5cf6";
      case "success": return "#10b981";
      case "warning": return "#f59e0b";
      case "danger": return "#ef4444";
      case "highlight": return "#f59e0b";
      case "note": return "#6366f1";
      default: return "#9ca3af";
    }
  },
  
  getEdgeColor: () => "#94a3b8"
};

export default NodeStyles;