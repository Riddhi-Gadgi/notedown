import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Pin,
  Trash2,
  Calendar,
  X,
  Palette,
  Folder,
  ChevronDown,
} from "lucide-react";
import { useNotes } from "./NotesContext";

// Updated vibrant color options
const colorOptions = [
  {
    value: "default",
    label: "Default",
    color: "bg-white",
    text: "text-gray-800",
    border: "border-gray-200",
  },
  {
    value: "sky",
    label: "Sky",
    color: "bg-sky-500",
    text: "text-white",
    border: "border-sky-600",
  },
  {
    value: "amber",
    label: "Amber",
    color: "bg-amber-400",
    text: "text-gray-900",
    border: "border-amber-500",
  },
  {
    value: "emerald",
    label: "Emerald",
    color: "bg-emerald-500",
    text: "text-white",
    border: "border-emerald-600",
  },
  {
    value: "rose",
    label: "Rose",
    color: "bg-rose-500",
    text: "text-white",
    border: "border-rose-600",
  },
  {
    value: "indigo",
    label: "Indigo",
    color: "bg-indigo-600",
    text: "text-white",
    border: "border-indigo-700",
  },
  {
    value: "violet",
    label: "Violet",
    color: "bg-violet-500",
    text: "text-white",
    border: "border-violet-600",
  },
  {
    value: "fuchsia",
    label: "Fuchsia",
    color: "bg-fuchsia-500",
    text: "text-white",
    border: "border-fuchsia-600",
  },
];

const Notes = () => {
  const { notes, categories, addNote, updateNote, deleteNote, searchNotes } =
    useNotes();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    noteId: null,
    noteTitle: "",
  });
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [pageColor, setPageColor] = useState("bg-gray-50");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    let filtered = searchQuery ? searchNotes(searchQuery) : notes;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((note) => note.category === selectedCategory);
    }

    // Sort: pinned first, then by updated date
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    setFilteredNotes(filtered);
  }, [notes, searchQuery, selectedCategory, searchNotes]);

  const createNewNote = () => {
    const newNote = {
      title: "",
      content: "",
      category: "personal",
      tags: [],
      isPinned: false,
      color: colorOptions[0].color,
      textColor: colorOptions[0].text,
      borderColor: colorOptions[0].border,
    };
    addNote(newNote);
    // Open the new note immediately
    setExpandedNoteId(Date.now().toString());
  };

  const handleNoteUpdate = (noteId, field, value) => {
    updateNote(noteId, { [field]: value });
  };

  const handlePin = (note) => {
    updateNote(note.id, { isPinned: !note.isPinned });
  };

  const openDeleteDialog = (noteId, noteTitle) => {
    setDeleteDialog({
      open: true,
      noteId,
      noteTitle: noteTitle || "this note",
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.noteId) {
      deleteNote(deleteDialog.noteId);
      if (expandedNoteId === deleteDialog.noteId) {
        setExpandedNoteId(null);
      }
    }
    setDeleteDialog({ open: false, noteId: null, noteTitle: "" });
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, noteId: null, noteTitle: "" });
  };

  // Get currently expanded note
  const expandedNote = expandedNoteId
    ? notes.find((note) => note.id === expandedNoteId)
    : null;

  // Get category for a note
  const getCategory = (note) => {
    return (
      categories.find((cat) => cat.id === note.category) || {
        id: "personal",
        name: "Personal",
        color: "bg-blue-500",
      }
    );
  };

  return (
    <div
      className={`h-full flex flex-col min-h-screen transition-colors duration-300 ${pageColor}`}
    >
      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteDialog.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-100 p-4"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center mb-5">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Delete Note
                </h3>
                <p className="text-gray-500 text-center">
                  Are you sure you want to delete{" "}
                  <span className="font-medium">
                    "{deleteDialog.noteTitle}"
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={cancelDelete}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmDelete}
                  className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Note View */}
      <AnimatePresence>
        {expandedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setExpandedNoteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={`${expandedNote.color} ${
                expandedNote.borderColor || "border-gray-300"
              } border rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-all duration-300`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex justify-between items-start border-b border-opacity-30">
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePin(expandedNote);
                    }}
                    className={`p-2 rounded-lg ${expandedNote.textColor} hover:bg-opacity-20 transition-all duration-200`}
                    title={expandedNote.isPinned ? "Unpin" : "Pin"}
                  >
                    <Pin
                      className={`w-5 h-5 ${
                        expandedNote.isPinned
                          ? "fill-amber-400 text-amber-400"
                          : ""
                      }`}
                    />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(expandedNote.id, expandedNote.title);
                    }}
                    className={`p-2 rounded-lg ${expandedNote.textColor} hover:bg-opacity-20 transition-all duration-200`}
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>

                  {/* Category Selector */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCategoryDropdown(!showCategoryDropdown);
                      }}
                      className={`flex items-center gap-1 px-2 py-1.5 rounded-lg ${expandedNote.textColor} hover:bg-opacity-20 transition-all duration-200`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          getCategory(expandedNote).color
                        }`}
                      />
                      <span className="text-sm">
                        {getCategory(expandedNote).name}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>

                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl z-50 w-48 overflow-hidden border border-gray-200"
                      >
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNoteUpdate(
                                expandedNote.id,
                                "category",
                                category.id
                              );
                              setShowCategoryDropdown(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 transition-colors text-left"
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${category.color}`}
                            />
                            <span className="text-gray-700">
                              {category.name}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setExpandedNoteId(null)}
                  className={`p-2 rounded-lg ${expandedNote.textColor} hover:bg-opacity-20 transition-all duration-200`}
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Theme Template Selector */}
              <div className="p-3 flex gap-2 overflow-x-auto border-b border-opacity-30 scrollbar-hide">
                {colorOptions.map((color) => (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      handleNoteUpdate(expandedNote.id, "color", color.color);
                      handleNoteUpdate(
                        expandedNote.id,
                        "textColor",
                        color.text
                      );
                      handleNoteUpdate(
                        expandedNote.id,
                        "borderColor",
                        color.border
                      );
                    }}
                    className={`min-w-8 h-8 rounded-full ${color.color} ${color.border} border transition-all duration-200 flex-shrink-0`}
                    title={`Set to ${color.label}`}
                  >
                    {expandedNote.color === color.color && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <Palette className={`${color.text} w-4 h-4`} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="flex-1 overflow-auto p-6 transition-colors duration-300">
                <input
                  type="text"
                  value={expandedNote.title}
                  onChange={(e) =>
                    handleNoteUpdate(expandedNote.id, "title", e.target.value)
                  }
                  className={`w-full text-2xl font-bold mb-4 bg-transparent border-none outline-none resize-none ${expandedNote.textColor} placeholder:${expandedNote.textColor} placeholder-opacity-50 transition-all duration-300`}
                  placeholder="Title"
                />
                <textarea
                  value={expandedNote.content}
                  onChange={(e) =>
                    handleNoteUpdate(expandedNote.id, "content", e.target.value)
                  }
                  className={`w-full h-full min-h-[50vh] text-lg bg-transparent border-none outline-none resize-none ${expandedNote.textColor} placeholder:${expandedNote.textColor} placeholder-opacity-50 transition-all duration-300`}
                  placeholder="Write your note here..."
                />
              </div>

              <div
                className={`p-4 text-sm ${expandedNote.textColor} opacity-70 border-t border-opacity-30 transition-colors duration-300`}
              >
                Last updated:{" "}
                {new Date(expandedNote.updatedAt).toLocaleString()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-20 transition-colors duration-300 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={createNewNote}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors shadow hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Note
          </motion.button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all duration-300 hover:shadow-sm"
          >
            <Filter className="w-4 h-4" />
            Filters
          </motion.button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 shadow-inner"
            >
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === "all"
                      ? "bg-black text-white shadow-inner"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                  } transition-all duration-200`}
                >
                  All Categories
                </motion.button>
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                      selectedCategory === category.id
                        ? "bg-black text-white shadow-inner"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                    } transition-all duration-200`}
                  >
                    <div className={`w-2 h-2 rounded-full ${category.color}`} />
                    {category.name} ({category.noteCount})
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-auto p-6 transition-colors duration-300">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No notes found</div>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search"
                : "Create your first note to get started"}
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            <AnimatePresence>
              {filteredNotes.map((note) => {
                const noteCategory = getCategory(note);

                return (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className={`${note.color} ${
                      note.borderColor || "border-gray-300"
                    } border rounded-lg p-4 transition-all duration-300 relative break-inside-avoid mb-4 cursor-pointer`}
                    onClick={() => setExpandedNoteId(note.id)}
                  >
                    {/* Pin indicator */}
                    {note.isPinned && (
                      <div className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 rounded-full shadow-sm">
                        <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </div>
                    )}

                    {/* Note content */}
                    <div className="mb-3">
                      <div
                        className={`font-semibold mb-2 ${
                          note.textColor || "text-gray-800"
                        } truncate transition-colors duration-300`}
                      >
                        {note.title || "Untitled Note"}
                      </div>
                      <div
                        className={`text-sm ${
                          note.textColor || "text-gray-600"
                        } line-clamp-3 transition-colors duration-300`}
                      >
                        {note.content || "No content"}
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      className={`flex items-center justify-between text-xs ${
                        note.textColor || "text-gray-500"
                      } transition-colors duration-300`}
                    >
                      <div className="flex items-center gap-1 opacity-80">
                        <div
                          className={`w-2 h-2 rounded-full ${noteCategory.color}`}
                        />
                        <span className="truncate max-w-[80px]">
                          {noteCategory.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
