import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FileText, FolderOpen, Calendar, Brain, Menu, X } from "lucide-react";

const username = "User";

const links = [
  {
    to: `/dashboard/notes`,
    label: "Notes",
    icon: FileText,
  },
  {
    to: `/dashboard/categories`,
    label: "Categories",
    icon: FolderOpen,
  },
  {
    to: `/dashboard/calendar`,
    label: "Calendar",
    icon: Calendar,
  },
  {
    to: `/dashboard/mindmap`,
    label: "Mind Map",
    icon: Brain,
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <aside
      className={`bg-black border-r border-gray-700 flex flex-col h-screen transition-all duration-300 ${
        collapsed ? "w-19" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span>
                <img
                  src="../src/assets/note-down-logo.svg"
                  width="27px"
                  alt="logo"
                />
              </span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-white font-bold text-lg">Note Down</h1>
                <p className="text-gray-400 text-sm">Welcome, {username}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4  relative">
        {!collapsed && (
          <div className="text-center text-gray-400 text-xs">
            <p>© 2024 Note Down</p>
            <p>Version 1.0.0</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`absolute bottom-4 ${
            collapsed ? "left-5" : "right-4"
          } text-gray-400 hover:text-white transition-colors`}
        >
          {collapsed ? (
            <Menu className="w-5 h-5 mt-2" />
          ) : (
            <X className="w-5 h-5 mt-2" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
