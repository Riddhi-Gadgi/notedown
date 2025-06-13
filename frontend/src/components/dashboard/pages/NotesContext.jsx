import React, { createContext, useContext, useState, useEffect } from "react";

const NotesContext = createContext(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([
    { id: "personal", name: "Personal", color: "bg-blue-500", noteCount: 0 },
    { id: "work", name: "Work", color: "bg-green-500", noteCount: 0 },
    { id: "ideas", name: "Ideas", color: "bg-purple-500", noteCount: 0 },
    { id: "todo", name: "To-Do", color: "bg-orange-500", noteCount: 0 },
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    const savedCategories = localStorage.getItem("categories");

    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
      setNotes(parsedNotes);
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save to localStorage whenever notes or categories change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // Update category note counts
  useEffect(() => {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        noteCount: notes.filter((note) => note.category === category.id).length,
      }))
    );
  }, [notes]);

  const addNote = (noteData) => {
    const newNote = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id, updates) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
      )
    );
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const addCategory = (categoryData) => {
    const newCategory = {
      ...categoryData,
      id: Date.now().toString(),
      noteCount: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id, updates) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      )
    );
  };

  const deleteCategory = (id) => {
    // Move notes from deleted category to 'personal'
    setNotes((prev) =>
      prev.map((note) =>
        note.category === id ? { ...note, category: "personal" } : note
      )
    );
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const searchNotes = (query) => {
    if (!query.trim()) return notes;

    const lowercaseQuery = query.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowercaseQuery) ||
        note.content.toLowerCase().includes(lowercaseQuery) ||
        (note.tags &&
          note.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)))
    );
  };

  const filterNotesByCategory = (categoryId) => {
    return notes.filter((note) => note.category === categoryId);
  };

  const value = {
    notes,
    categories,
    addNote,
    updateNote,
    deleteNote,
    addCategory,
    updateCategory,
    deleteCategory,
    searchNotes,
    filterNotesByCategory,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};
