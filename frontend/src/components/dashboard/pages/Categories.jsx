import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X,
  BookOpen
} from 'lucide-react';
import { useNotes } from './NotesContext';

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: 'default'
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    
    if (editingCategory) {
      updateCategory(editingCategory, formData);
      setEditingCategory(null);
    } else {
      addCategory(formData);
    }
    
    resetForm();
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: 'default'
    });
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      color: category.color
    });
    setEditingCategory(category.id);
    setIsCreating(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure? Notes in this category will be moved to Personal.')) {
      deleteCategory(categoryId);
    }
  };

  // Helper to get color object by value
  const getColorObj = (colorValue) => {
    return colorOptions.find(opt => opt.value === colorValue) || colorOptions[0];
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Organize your notes with custom categories</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreating(true)}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Category
          </motion.button>
        </div>
      </div>

      {/* Categories Grid - Simplified Card Style */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {categories.map(category => {
              const colorObj = getColorObj(category.color);
              return (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative"
                >
                  {/* Simplified card */}
                  <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Color header */}
                    <div className={`h-3 ${colorObj.color}`}></div>
                    
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 ${colorObj.color} rounded-lg flex items-center justify-center shadow-md`}>
                          <BookOpen className={`w-5 h-5 ${colorObj.text}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate">{category.name}</h3>
                          <p className="text-gray-500 text-sm">
                            {category.noteCount} {category.noteCount === 1 ? 'note' : 'notes'}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Edit category"
                          >
                            <Edit3 className="w-4 h-4 text-gray-600" />
                          </button>
                          {category.id !== 'personal' && (
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-500 mb-4">Create your first category to organize your notes</p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Category
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingCategory(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter category name..."
                      required
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color: option.value }))}
                          className={`w-8 h-8 rounded-lg ${option.color} border-2 ${
                            formData.color === option.value 
                              ? 'border-black ring-2 ring-offset-2 ring-blue-500' 
                              : 'border-gray-300'
                          } hover:scale-105 transition-transform`}
                          title={option.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${getColorObj(formData.color).color} rounded-lg flex items-center justify-center shadow-md`}>
                        <BookOpen className={`w-5 h-5 ${getColorObj(formData.color).text}`} />
                      </div>
                      <div>
                        <p className="font-medium truncate max-w-[150px]">
                          {formData.name || 'Category Name'}
                        </p>
                        <p className="text-gray-500 text-sm">0 notes</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingCategory(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;