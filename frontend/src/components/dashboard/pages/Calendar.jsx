import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  FileText,
} from "lucide-react";
import { useNotes } from "./NotesContext";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
} from "date-fns";

const Calendar = () => {
  const { notes } = useNotes();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get notes for each day
  const notesByDate = useMemo(() => {
    const grouped = {};

    notes.forEach((note) => {
      const dateKey = format(note.createdAt, "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(note);
    });

    return grouped;
  }, [notes]);

  const getNotesForDate = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return notesByDate[dateKey] || [];
  };

  const selectedDateNotes = selectedDate ? getNotesForDate(selectedDate) : [];

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDayClasses = (date) => {
    const baseClasses =
      "w-full h-24 p-2 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer";
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isTodayDate = isToday(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const hasNotes = getNotesForDate(date).length > 0;

    let classes = baseClasses;

    if (!isCurrentMonth) {
      classes += " text-gray-400 bg-gray-50";
    }

    if (isTodayDate) {
      classes += " bg-black text-white";
    }

    if (isSelected) {
      classes += " bg-gray-800 text-white";
    }

    if (hasNotes) {
      classes += " border-l-4 border-l-black";
    }

    return classes;
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Calendar */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-700 min-w-[200px] text-center">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                <button
                  onClick={() => navigateMonth("next")}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setCurrentDate(new Date())}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-400 hover:text-black transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 p-6">
          <div className="bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-4 text-center font-semibold text-gray-700 bg-gray-50"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((date) => {
                const dayNotes = getNotesForDate(date);
                return (
                  <motion.div
                    key={date.toISOString()}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedDate(date)}
                    className={getDayClasses(date)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`text-sm font-medium ${
                          isToday(date) ? "text-white" : "text-gray-00"
                        }`}
                      >
                        {format(date, "d")}
                      </span>
                      {dayNotes.length > 0 && (
                        <span className="bg-black text-white text-xs px-1.5 py-0.5 rounded-full">
                          {dayNotes.length}
                        </span>
                      )}
                    </div>

                    {/* Show first few notes */}
                    <div className="space-y-1">
                      {dayNotes.slice(0, 2).map((note) => (
                        <div
                          key={note.id}
                          className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded truncate"
                        >
                          {note.title}
                        </div>
                      ))}
                      {dayNotes.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayNotes.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {selectedDate
              ? format(selectedDate, "MMMM d, yyyy")
              : "Select a date"}
          </h3>
          {selectedDate && (
            <p className="text-sm text-gray-600 mt-1">
              {selectedDateNotes.length}{" "}
              {selectedDateNotes.length === 1 ? "note" : "notes"}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          {selectedDate ? (
            selectedDateNotes.length > 0 ? (
              <div className="p-4 space-y-3">
                {selectedDateNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {note.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {format(note.createdAt, "HH:mm")}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                      {note.content}
                    </p>

                    {/* FIXED: Check if tags exists before accessing length */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <FileText className="w-12 h-12 text-gray-300 mb-3" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No notes
                </h4>
                <p className="text-gray-500 text-sm mb-4">
                  No notes were created on{" "}
                  {format(selectedDate, "MMMM d, yyyy")}
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <CalendarIcon className="w-12 h-12 text-gray-300 mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Select a date
              </h4>
              <p className="text-gray-500 text-sm">
                Click on a date to view notes created on that day
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-black">
                {notes.length}
              </div>
              <div className="text-xs text-gray-600">Total Notes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">
                {Object.keys(notesByDate).length}
              </div>
              <div className="text-xs text-gray-600">Active Days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
