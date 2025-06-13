import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  FolderOpen,
  X
} from 'lucide-react';
import { useNotes } from './NotesContext';

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: 'bg-blue-500'
  });

  const colorOptions = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-teal-500',
    'bg-gray-500'
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
      color: 'bg-blue-500'
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

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Organize your notes with colorful categories</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Category
          </motion.button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {categories.map(category => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <FolderOpen className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(category)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Edit category"
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </motion.button>
                    {category.id !== 'personal' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(category.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </motion.button>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.noteCount} {category.noteCount === 1 ? 'note' : 'notes'}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${category.color} rounded-full`} />
                    <span className="text-xs text-gray-500">Category Color</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {category.id === 'personal' ? 'Default' : 'Custom'}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-500 mb-4">Create your first category to organize your notes</p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
              className="bg-white rounded-xl w-full max-w-md shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingCategory(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter category name..."
                      required
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Choose Color
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {colorOptions.map(color => (
                        <motion.button
                          key={color}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                          className={`w-12 h-12 rounded-xl ${color} border-3 ${
                            formData.color === color ? 'border-gray-800 ring-2 ring-gray-300' : 'border-gray-200'
                          } hover:shadow-lg transition-all duration-200`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-3">Preview:</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${formData.color} rounded-lg flex items-center justify-center shadow-md`}>
                        <FolderOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{formData.name || 'Category Name'}</span>
                        <p className="text-xs text-gray-500">0 notes</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingCategory(null);
                        resetForm();
                      }}
                      className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </motion.button>
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