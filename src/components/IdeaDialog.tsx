import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Tag, Layers, CheckSquare } from 'lucide-react';
import { IdeaCard, BoardColumn } from '../types';
import { COLOR_PALETTES } from '../data/initialData';

interface IdeaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Omit<IdeaCard, 'id' | 'createdAt'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  cardToEdit?: IdeaCard | null;
  columns: BoardColumn[];
  defaultCategory?: string;
  theme: 'light' | 'dark' | 'contrast';
}

export default function IdeaDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  cardToEdit,
  columns,
  defaultCategory,
  theme
}: IdeaDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('amber');
  const [error, setError] = useState<string | null>(null);

  // Sync state with selected content during editing
  useEffect(() => {
    if (cardToEdit) {
      setTitle(cardToEdit.title);
      setContent(cardToEdit.content);
      setCategory(cardToEdit.category);
      setColor(cardToEdit.color);
      setError(null);
    } else {
      setTitle('');
      setContent('');
      setCategory(defaultCategory || columns[0]?.id || 'backlog');
      setColor('amber');
      setError(null);
    }
  }, [cardToEdit, isOpen, defaultCategory, columns]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() && !content.trim()) {
      setError('An idea needs at least a title or a description!');
      return;
    }

    onSave({
      id: cardToEdit?.id,
      title: title.trim(),
      content: content.trim(),
      category,
      color
    });
  };

  const handleSelfDelete = () => {
    if (cardToEdit && onDelete) {
      onDelete(cardToEdit.id);
    }
  };

  const modalBg = theme === 'dark' ? 'bg-[#131C30] border-indigo-500 shadow-[8px_8px_0px_0px_rgba(99,102,241,0.4)]' : theme === 'contrast' ? 'bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-[#0F172A] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]';
  const headerClass = theme === 'dark' ? 'border-b-2 border-indigo-550 bg-[#1E293B] text-slate-100' : theme === 'contrast' ? 'border-b-4 border-black bg-white text-black' : 'border-b-2 border-slate-900 bg-slate-50 text-slate-900';
  const labelClass = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const inputClass = theme === 'dark' ? 'border-[#6366F1] bg-[#0F172A] text-white focus:ring-indigo-400 focus:border-indigo-400' : theme === 'contrast' ? 'border-black bg-white text-black font-black' : 'border-slate-900 bg-white text-slate-905 focus:ring-indigo-500';
  const titleClass = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const subtitleClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const errorClass = theme === 'dark' ? 'bg-rose-950/40 border-indigo-500 text-rose-300' : 'bg-rose-100 border-slate-900 text-rose-805';
  const discardBtnClass = theme === 'dark' ? 'border-indigo-500 bg-rose-950/40 hover:bg-rose-900/30 text-rose-200' : theme === 'contrast' ? 'border-black bg-white hover:bg-rose-50 text-rose-800' : 'border-slate-900 bg-rose-150 bg-rose-100 hover:bg-rose-200 text-rose-700';
  const dividerClass = theme === 'dark' ? 'border-indigo-500/30' : theme === 'contrast' ? 'border-black' : 'border-[#0F172A]';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
          className={`relative w-full max-w-md overflow-hidden rounded-3xl border-4 z-10 ${modalBg}`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b-2 px-6 py-4 ${headerClass}`}>
            <div>
              <h2 className={`font-display text-xl font-black uppercase tracking-tight ${titleClass}`}>
                {cardToEdit ? 'Modify Sticky Idea' : 'Pin New Idea Card'}
              </h2>
              <p className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${subtitleClass}`}>
                Draft concepts, details, or checklist task notes
              </p>
            </div>
            <button
              id="close-idea-dialog-btn"
              onClick={onClose}
              className={`p-1.5 rounded-lg border-2 transition-colors cursor-pointer ${
                theme === 'dark' ? 'border-indigo-500 bg-[#0F172A] hover:bg-slate-800 text-[#38BDF8]' : theme === 'contrast' ? 'border-black bg-white hover:bg-yellow-101 text-black' : 'border-slate-900 bg-slate-100 hover:bg-slate-205 text-slate-900'
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

            {/* Note Title */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${labelClass}`}>
                Idea Title / Identifier
              </label>
              <input
                id="idea-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Microfeedback system, Color styling rules..."
                className={`w-full px-3.5 py-2 border-2 rounded-xl focus:outline-hidden focus:ring-2 text-sm placeholder:text-slate-400 transition-all font-bold ${inputClass}`}
              />
            </div>

            {/* Category selection */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${labelClass}`}>
                <Layers className="w-3.5 h-3.5" /> Board Section / Lane
              </label>
              <select
                id="idea-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3.5 py-2 border-2 rounded-xl focus:outline-hidden focus:ring-2 text-sm transition-all font-bold cursor-pointer ${inputClass}`}
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Sticky Note Color selection */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${labelClass}`}>
                Card Accent Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    id={`idea-color-${palette.id}`}
                    key={palette.id}
                    type="button"
                    onClick={() => setColor(palette.id)}
                    className={`w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center transition-all cursor-pointer ${palette.bg} ${
                      color === palette.id
                        ? 'scale-110 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                        : 'hover:scale-105'
                    }`}
                    title={palette.name}
                  >
                    {color === palette.id && (
                      <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${labelClass}`}>
                Sticky Notes Description
              </label>
              <textarea
                id="idea-content-input"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your creative thoughts, checklist items, links or resource notes here..."
                className={`w-full px-3.5 py-2 border-2 rounded-xl focus:outline-hidden focus:ring-2 text-sm placeholder:text-slate-400 transition-all font-bold resize-none ${inputClass}`}
              />
            </div>

            {/* Footer buttons row */}
            <div className={`flex items-center justify-between border-t-2 pt-4 mt-6 ${dividerClass}`}>
              {cardToEdit && onDelete ? (
                <button
                  id="delete-idea-btn"
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
                  id="cancel-idea-btn"
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 border-2 text-slate-850 rounded-xl transition-all text-xs font-black uppercase tracking-wider cursor-pointer ${
                    theme === 'dark' ? 'border-indigo-500 bg-[#0F172A] hover:bg-slate-800 text-slate-300' : 'border-slate-905 border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  id="save-idea-btn"
                  type="submit"
                  className={`px-4 py-2 text-white rounded-xl border-2 transition-all text-xs font-black uppercase tracking-wider cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-indigo-650 hover:bg-indigo-600 border-indigo-500 shadow-[2px_2px_0px_0px_rgba(99,102,241,0.55)]'
                      : theme === 'contrast'
                      ? 'bg-[#FDE047] hover:bg-[#FACC15] border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-indigo-600 hover:bg-indigo-500 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                  }`}
                >
                  {cardToEdit ? 'Save Changes' : 'Pin Idea'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
