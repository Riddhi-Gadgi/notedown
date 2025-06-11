import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Notes from "./Notes";
import Categories from "./Categories";
import Calendar from "./Calendar";
import MindMap from "./MindMap";
import { NotesProvider } from "./NotesContext";
import MapEditor from "../MindMap/MapEditor";
import EditableNode from "../MindMap/EditableNode";

function Dashboard() {
  return (
    <NotesProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="notes" replace />} />
            <Route path="notes" element={<Notes />} />
            <Route path="categories" element={<Categories />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="mindmap" element={<MindMap />} />
            <Route path="mindmap/editor/:id" element={<MapEditor />} />
          </Routes>
        </main>
      </div>
    </NotesProvider>
  );
}

export default Dashboard;
