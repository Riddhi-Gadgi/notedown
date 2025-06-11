import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  Zap,
  Brain,
  Plus,
  Clock,
  Trash2,
  Star,
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Copy,
  Download,
  Grid,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mapTemplates = [
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start with a clean slate",
    icon: <Plus className="w-8 h-8 text-white" />,
    type: "mindmap",
    bgColor: "bg-gradient-to-br from-gray-900 to-black",
  },
];

// Function to get data from localStorage
const getStoredData = (key, defaultValue = []) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export default function MindMap() {
  const navigate = useNavigate();
  const [recentMaps, setRecentMaps] = useState([]);
  const [favoriteMaps, setFavoriteMaps] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Load data on component mount
  useEffect(() => {
    setRecentMaps(getStoredData("recentMaps"));
    setFavoriteMaps(getStoredData("favoriteMaps"));
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    setStoredData("recentMaps", recentMaps);
  }, [recentMaps]);

  useEffect(() => {
    setStoredData("favoriteMaps", favoriteMaps);
  }, [favoriteMaps]);

  const handleMapClick = (template) => {
    const id = uuidv4();
    const newMap = {
      id,
      name: template.name,
      type: template.type,
      templateId: template.id,
      timestamp: Date.now(),
      isFavorite: false,
    };

    // Add to recent maps (limit to 10)
    const updatedRecent = [
      newMap,
      ...recentMaps.filter((map) => map.id !== id).slice(0, 9),
    ];

    setRecentMaps(updatedRecent);
    navigate(`/dashboard/mindmap/editor/${id}`);
  };

  const openRecentMap = (mapId) => {
    navigate(`/dashboard/mindmap/editor/${mapId}`);
  };

  const toggleFavorite = (mapId, e) => {
    e.stopPropagation();

    const mapToToggle = recentMaps.find((map) => map.id === mapId);
    if (!mapToToggle) return;

    const updatedMap = { ...mapToToggle, isFavorite: !mapToToggle.isFavorite };

    // Update recent maps
    setRecentMaps((prev) =>
      prev.map((map) => (map.id === mapId ? updatedMap : map))
    );

    // Update favorites
    if (updatedMap.isFavorite) {
      setFavoriteMaps((prev) => [...prev, updatedMap]);
    } else {
      setFavoriteMaps((prev) => prev.filter((map) => map.id !== mapId));
    }
  };

  const deleteMap = (mapId, e) => {
    e.stopPropagation();
    setRecentMaps((prev) => prev.filter((map) => map.id !== mapId));
    setFavoriteMaps((prev) => prev.filter((map) => map.id !== mapId));
  };

  const duplicateMap = (mapId, e) => {
    e.stopPropagation();
    const mapToDuplicate = recentMaps.find((map) => map.id === mapId);
    if (!mapToDuplicate) return;

    const newId = uuidv4();
    const duplicatedMap = {
      ...mapToDuplicate,
      id: newId,
      name: `${mapToDuplicate.name} (Copy)`,
      timestamp: Date.now(),
      isFavorite: false,
    };

    setRecentMaps((prev) => [duplicatedMap, ...prev.slice(0, 9)]);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getFilteredMaps = () => {
    let maps = [];

    switch (selectedFilter) {
      case "recent":
        maps = recentMaps;
        break;
      case "favorites":
        maps = favoriteMaps;
        break;
      default:
        maps = recentMaps;
    }

    if (searchQuery) {
      maps = maps.filter((map) =>
        map.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return maps;
  };

  const MapCard = ({ map, showActions = true }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -3 }}
      onClick={() => openRecentMap(map.id)}
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-black p-2 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {map.name || "Untitled Map"}
            </h3>
            <p className="text-sm text-gray-500">{formatDate(map.timestamp)}</p>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => toggleFavorite(map.id, e)}
              className={`p-1.5 rounded-full hover:bg-gray-100 ${
                map.isFavorite ? "text-black" : "text-gray-400"
              }`}
              title={
                map.isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Star
                className={`w-4 h-4 ${map.isFavorite ? "fill-current" : ""}`}
              />
            </button>

            <div className="relative group/menu">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <MoreVertical className="w-4 h-4" />
              </button>

              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover/menu:opacity-100 transition-opacity z-10 min-w-[120px]">
                <button
                  onClick={(e) => duplicateMap(map.id, e)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy className="w-3 h-3" />
                  Duplicate
                </button>
                <button
                  onClick={(e) => deleteMap(map.id, e)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 flex items-center gap-2">
        <span className="capitalize">{map.type}</span>
        {map.templateId && (
          <>
            <span>•</span>
            <span>
              {mapTemplates.find((t) => t.id === map.templateId)?.name}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mind Maps
              </h1>
              <p className="text-gray-600">
                Create and organize your visual thinking
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search maps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent w-64"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All Maps" },
                    { id: "recent", label: "Recent" },
                    { id: "favorites", label: "Favorites" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedFilter === filter.id
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Templates Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Create New Map</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mapTemplates.map((template, idx) => (
              <motion.button
                key={template.id}
                onClick={() => handleMapClick(template)}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-black border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Background Image */}
                <div className="relative h-32 overflow-hidden">
                  {/* Icon */}
                  <div className="absolute  mx-24 my-12  w-10 h-10 bg-black/80 rounded-lg flex items-center justify-center">
                    {template.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 text-left">
                  <h3 className="font-semibold text-gray-200 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {template.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {getFilteredMaps().length === 0 &&
          (recentMaps.length > 0 || searchQuery) && (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "No maps found" : "No maps in this category"}
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Create your first mind map to get started"}
              </p>
            </div>
          )}

        {/* Quick Stats */}
      </div>
    </div>
  );
}
