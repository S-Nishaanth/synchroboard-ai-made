import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Clock, MapPin, AlignLeft, Calendar } from 'lucide-react';
import { TimetableEvent, DayOfWeek } from '../types';
import { COLOR_PALETTES } from '../data/initialData';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<TimetableEvent, 'id'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  eventToEdit?: TimetableEvent | null;
  defaultDay?: DayOfWeek;
  defaultTime?: string;
  theme: 'light' | 'dark' | 'contrast';
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function EventDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  eventToEdit,
  defaultDay,
  defaultTime,
  theme
}: EventDialogProps) {
  const [name, setName] = useState('');
  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState('violet');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync state with selected event during editing
  useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name);
      setDay(eventToEdit.day);
      setStartTime(eventToEdit.startTime);
      setEndTime(eventToEdit.endTime);
      setColor(eventToEdit.color);
      setDescription(eventToEdit.description || '');
      setLocation(eventToEdit.location || '');
      setError(null);
    } else {
      setName('');
      setDay(defaultDay || 'Monday');
      setStartTime(defaultTime || '09:00');
      
      // Calculate a default end time (1 hour later)
      if (defaultTime) {
        const [hours, mins] = defaultTime.split(':').map(Number);
        const endHour = Math.min(hours + 1, 23);
        const endHourStr = endHour.toString().padStart(2, '0');
        const minStr = mins.toString().padStart(2, '0');
        setEndTime(`${endHourStr}:${minStr}`);
      } else {
        setEndTime('10:00');
      }

      setColor('violet');
      setDescription('');
      setLocation('');
      setError(null);
    }
  }, [eventToEdit, isOpen, defaultDay, defaultTime]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Event name is required');
      return;
    }

    // Validate times
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startNum = startH * 60 + startM;
    const endNum = endH * 60 + endM;

    if (startNum >= endNum) {
      setError('End time must be strictly after the start time');
      return;
    }

    onSave({
      id: eventToEdit?.id,
      name: name.trim(),
      day,
      startTime,
      endTime,
      color,
      description: description.trim() || undefined,
      location: location.trim() || undefined
    });
  };

  const handleSelfDelete = () => {
    if (eventToEdit && onDelete) {
      onDelete(eventToEdit.id);
    }
  };

  const modalBg = theme === 'dark' ? 'bg-[#131C30] border-indigo-500 shadow-[8px_8px_0px_0px_rgba(99,102,241,0.4)]' : theme === 'contrast' ? 'bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-[#0F172A] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]';
  const headerClass = theme === 'dark' ? 'border-b-2 border-indigo-550 bg-[#1E293B] text-slate-100' : theme === 'contrast' ? 'border-b-4 border-black bg-white text-black' : 'border-b-2 border-slate-900 bg-slate-50 text-slate-900';
  const labelClass = theme === 'dark' ? 'text-slate-200' : 'text-slate-900';
  const inputClass = theme === 'dark' ? 'border-[#6366F1] bg-[#0F172A] text-white focus:ring-indigo-400 focus:border-indigo-400' : theme === 'contrast' ? 'border-black bg-white text-black font-black' : 'border-slate-900 bg-white text-slate-900 focus:ring-indigo-500';
  const titleClass = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const subtitleClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const errorClass = theme === 'dark' ? 'bg-rose-950/40 border-indigo-500 text-rose-300' : 'bg-rose-100 border-slate-900 text-rose-805';
  const discardBtnClass = theme === 'dark' ? 'border-indigo-500 bg-rose-950/40 hover:bg-rose-900/30 text-rose-200' : theme === 'contrast' ? 'border-black bg-white hover:bg-rose-50 text-rose-800' : 'border-slate-900 bg-rose-150 bg-rose-100 hover:bg-rose-200 text-rose-700';
  const dividerClass = theme === 'dark' ? 'border-indigo-500/30' : theme === 'contrast' ? 'border-black' : 'border-[#0F172A]';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
          className={`relative w-full max-w-lg overflow-hidden rounded-3xl border-4 z-10 ${modalBg}`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b-2 px-6 py-4 ${headerClass}`}>
            <div>
              <h2 className={`font-display text-xl font-black uppercase tracking-tight ${titleClass}`}>
                {eventToEdit ? 'Modify Timetable Block' : 'Draft Timetable Block'}
              </h2>
              <p className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${subtitleClass}`}>
                Lock down a weekly schedule block
              </p>
            </div>
            <button
              id="close-dialog-btn"
              onClick={onClose}
              className={`p-1.5 rounded-lg border-2 transition-colors cursor-pointer ${
                theme === 'dark' ? 'border-indigo-500 bg-[#0F172A] hover:bg-slate-800 text-[#38BDF8]' : theme === 'contrast' ? 'border-black bg-white hover:bg-yellow-100 text-black' : 'border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className={`p-3 text-xs border-2 rounded-xl font-extrabold uppercase tracking-wide ${errorClass}`}>
                {error}
              </div>
            )}

            {/* Event Name */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${labelClass}`}>
                Block Title / Activity
              </label>
              <input
                id="event-title-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Creative Layout, Sync Meeting, Lunch..."
                className={`w-full px-3.5 py-2 border-2 rounded-xl focus:outline-hidden focus:ring-2 text-sm placeholder:text-slate-400 transition-all font-bold ${inputClass}`}
              />
            </div>

            {/* Day and Times layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${labelClass}`}>
                  <Calendar className="w-3.5 h-3.5" /> Day of Week
                </label>
                <select
                  id="event-day-select"
                  value={day}
                  onChange={(e) => setDay(e.target.value as DayOfWeek)}
                  className={`w-full px-3.5 py-2 border-2 rounded-xl focus:outline-hidden focus:ring-2 text-sm transition-all font-bold cursor-pointer ${inputClass}`}
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${labelClass}`}>
                    <Clock className="w-3.5 h-3.5" /> Start
                  </label>
                  <input
                    id="event-start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`w-full px-3 py-1.5 border-2 rounded-xl text-sm focus:outline-hidden focus:ring-2 transition-all font-mono font-bold ${inputClass}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${labelClass}`}>
                    <Clock className="w-3.5 h-3.5" /> End
                  </label>
                  <input
                    id="event-end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={`w-full px-3 py-1.5 border-2 rounded-xl text-sm focus:outline-hidden focus:ring-2 transition-all font-mono font-bold ${inputClass}`}
                  />
                </div>
              </div>
            </div>

            {/* Custom Theme selection */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${labelClass}`}>
                Visual Coding Accent
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    id={`color-choice-${palette.id}`}
                    key={palette.id}
                    type="button"
                    onClick={() => setColor(palette.id)}
                    className={`px-3 py-1.5 rounded-lg border-2 border-slate-900 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                      color === palette.id
                        ? 'bg-slate-950 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                        : `${palette.bg} hover:brightness-95`
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full border border-slate-900 ${palette.dot} ${color === palette.id ? 'bg-white' : ''}`} />
                    {palette.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${labelClass}`}>
                <MapPin className="w-3.5 h-3.5" /> Location / Meeting URL
              </label>
              <input
                id="event-location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lab 4B, Zoom link, Home Office..."
                className={`w-full px-3.5 py-2 border-2 rounded-xl focus:outline-hidden focus:ring-2 text-sm placeholder:text-slate-400 transition-all font-bold ${inputClass}`}
              />
            </div>

            {/* Description / Subnotes */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${labelClass}`}>
                <AlignLeft className="w-3.5 h-3.5" /> Notes / Objectives
              </label>
              <textarea
                id="event-description-input"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What objectives are associated with this block?"
                className={`w-full px-3.5 py-2 border-2 rounded-xl focus:outline-hidden focus:ring-2 text-sm placeholder:text-slate-400 transition-all resize-none font-bold ${inputClass}`}
              />
            </div>

            {/* Footer Buttons */}
            <div className={`flex items-center justify-between border-t-2 pt-4 mt-6 ${dividerClass}`}>
              {eventToEdit && onDelete ? (
                <button
                  id="delete-event-btn"
                  type="button"
                  onClick={handleSelfDelete}
                  className={`px-3.5 py-2 rounded-xl border-2 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${discardBtnClass}`}
                >
                  <Trash2 className="w-4 h-4" />
                  Discard
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  id="cancel-event-btn"
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 border-2 text-slate-850 rounded-xl transition-all text-xs font-black uppercase tracking-wider cursor-pointer ${
                    theme === 'dark' ? 'border-indigo-500 bg-[#0F172A] hover:bg-slate-800 text-slate-300' : 'border-slate-905 border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  id="save-event-btn"
                  type="submit"
                  className={`px-4 py-2 text-white rounded-xl border-2 transition-all text-xs font-black uppercase tracking-wider cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-indigo-650 hover:bg-indigo-600 border-indigo-500 shadow-[2px_2px_0px_0px_rgba(99,102,241,0.55)]'
                      : theme === 'contrast'
                      ? 'bg-[#FDE047] hover:bg-[#FACC15] border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-indigo-600 hover:bg-indigo-500 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                  }`}
                >
                  {eventToEdit ? 'Save Block' : 'Add Block'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
