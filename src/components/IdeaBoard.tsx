import React, { useState } from 'react';
import { Plus, Search, MoveRight, MoveLeft, Edit3, Trash2, Calendar, Sparkles } from 'lucide-react';
import { IdeaCard, BoardColumn } from '../types';
import { COLOR_PALETTES } from '../data/initialData';

interface IdeaBoardProps {
  cards: IdeaCard[];
  columns: BoardColumn[];
  onAddCard: (category?: string) => void;
  onEditCard: (card: IdeaCard) => void;
  onUpdateCardCategory: (cardId: string, newCategory: string) => void;
  onDeleteCard: (id: string) => void;
  theme: 'light' | 'dark' | 'contrast';
}

export default function IdeaBoard({
  cards,
  columns,
  onAddCard,
  onEditCard,
  onUpdateCardCategory,
  onDeleteCard,
  theme
}: IdeaBoardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string | 'all'>('all');
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  // Dynamic filter lists
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor = selectedColorFilter === 'all' || card.color === selectedColorFilter;
    return matchesSearch && matchesColor;
  });

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // necessary to permit drop
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain') || draggedCardId;
    if (cardId) {
      onUpdateCardCategory(cardId, targetCategoryId);
    }
    setDraggedCardId(null);
  };

  // Immediate movement utility
  const handleShiftCategory = (card: IdeaCard, direction: 'left' | 'right') => {
    const currentIndex = columns.findIndex(col => col.id === card.category);
    if (currentIndex === -1) return;

    let targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    // Keep in ranges
    if (targetIndex >= 0 && targetIndex < columns.length) {
      onUpdateCardCategory(card.id, columns[targetIndex].id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Filtering and Search Toolbar */}
      <div className={
        theme === 'dark'
          ? 'bg-[#131C30] p-4 rounded-3xl border-2 border-indigo-505 shadow-[6px_6px_0px_0px_rgba(99,102,241,0.4)] flex flex-wrap gap-4 items-center justify-between transition-colors duration-200'
          : theme === 'contrast'
          ? 'bg-white p-4 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-wrap gap-4 items-center justify-between'
          : 'bg-white p-4 rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-wrap gap-4 items-center justify-between transition-colors duration-200'
      }>
        <div className={`flex flex-1 min-w-[240px] items-center gap-2 border-2 rounded-xl px-3 py-2 transition-all ${
          theme === 'dark'
            ? 'border-indigo-500 bg-[#0F172A]'
            : theme === 'contrast'
            ? 'border-2 border-black bg-white focus-within:ring-4 focus-within:ring-black'
            : 'border-slate-900 bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-600 focus-within:bg-white'
        }`}>
          <Search className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`} />
          <input
            id="idea-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords or descriptions on sticky notes..."
            className={`bg-transparent border-0 outline-hidden w-full text-xs font-bold ${
              theme === 'dark' ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-3 font-bold">
          <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-105' : 'text-slate-900'}`}>
            Color Code:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              id="filter-color-all"
              onClick={() => setSelectedColorFilter('all')}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg border-2 transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                selectedColorFilter === 'all'
                  ? theme === 'dark'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-[2px_2px_0px_0px_rgba(99,102,241,0.5)]'
                    : theme === 'contrast'
                    ? 'bg-[#FDE047] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-slate-900 text-white border-slate-900'
                  : theme === 'dark'
                  ? 'bg-[#1E293B] text-slate-300 border-indigo-500 hover:bg-[#334155]'
                  : theme === 'contrast'
                  ? 'bg-white text-black border-black hover:bg-yellow-50'
                  : 'bg-white text-slate-900 border-slate-900 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            {COLOR_PALETTES.map((p) => {
              const count = cards.filter(c => c.color === p.id).length;
              return (
                <button
                  id={`filter-color-${p.id}`}
                  key={p.id}
                  onClick={() => setSelectedColorFilter(p.id)}
                  className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center text-[10px] ${p.bg} ${
                    selectedColorFilter === p.id
                      ? theme === 'contrast'
                        ? 'border-black scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'border-slate-950 scale-110 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                      : theme === 'dark'
                      ? 'border-indigo-400 cursor-pointer hover:scale-105'
                      : 'border-slate-900 cursor-pointer hover:scale-105'
                  }`}
                  title={`Filter by ${p.name}`}
                >
                  {count > 0 && <span className="opacity-90 font-black text-[9px] text-slate-900">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Boards / Kanban rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const columnCards = filteredCards.filter((card) => card.category === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`border-2 rounded-3xl p-5 flex flex-col min-h-[450px] transition-all ${
                theme === 'dark'
                  ? 'bg-[#131C30] border-indigo-505 shadow-[4px_4px_0px_0px_rgba(99,102,241,0.4)] hover:bg-[#1E293B]/40'
                  : theme === 'contrast'
                  ? 'bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-50/20'
              }`}
            >
              
              {/* Column Header */}
              <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${
                theme === 'dark' ? 'border-indigo-500/20' : theme === 'contrast' ? 'border-black' : 'border-slate-900/10'
              }`}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-3.5 h-3.5 rounded-full border ${theme === 'contrast' ? 'border-black' : 'border-slate-900'} ${col.color}`} />
                  <h3 className={`font-display font-black text-xs uppercase tracking-wider truncate inline-flex gap-1.5 items-center ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {col.title}
                  </h3>
                  <span className={`text-[10px] font-mono font-bold border px-1.5 py-0.5 rounded-full ${
                    theme === 'dark' ? 'text-slate-200 bg-[#0F172A] border-indigo-505' : 'text-slate-900 bg-slate-100 border-slate-900'
                  }`}>
                    {columnCards.length}
                  </span>
                </div>
                <button
                  id={`add-to-col-${col.id}`}
                  onClick={() => onAddCard(col.id)}
                  className={`p-1 rounded-lg border transition-all cursor-pointer shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] active:translate-y-[1px] active:shadow-none ${
                    theme === 'dark'
                      ? 'border-indigo-500 bg-[#0F172A] hover:bg-slate-800 text-[#38BDF8] shadow-[1px_1px_0px_0px_rgba(99,102,241,0.4)]'
                      : theme === 'contrast'
                      ? 'border-2 border-black bg-white hover:bg-yellow-101 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'border-slate-900 bg-slate-100 hover:bg-slate-205 text-slate-900'
                  }`}
                  title="Add card here"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Column Sticky Cards Body */}
              <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto pr-0.5 scrollbar-thin">
                {columnCards.length === 0 ? (
                  <div className={`h-28 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-3 text-center ${
                    theme === 'dark' ? 'border-slate-700 bg-[#0F172A]/40 text-slate-400' : 'border-slate-300 bg-slate-50/30 text-slate-400'
                  }`}>
                    <Sparkles className="w-5 h-5 text-indigo-400 stroke-1 mb-1.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Lane is empty</span>
                    <button
                      id={`empty-add-to-${col.id}`}
                      onClick={() => onAddCard(col.id)}
                      className={`text-[10px] hover:underline font-extrabold uppercase tracking-widest mt-1 cursor-pointer ${
                        theme === 'dark' ? 'text-indigo-405' : 'text-indigo-600'
                      }`}
                    >
                      + Pin sticky
                    </button>
                  </div>
                ) : (
                  columnCards.map((card, idx) => {
                    const palette = COLOR_PALETTES.find(p => p.id === card.color) || COLOR_PALETTES[0];
                    const isFirstCol = col.id === columns[0].id;
                    const isLastCol = col.id === columns[columns.length - 1].id;

                    const cardBorder = theme === 'contrast' ? 'border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]';

                    return (
                      <div
                        id={`idea-card-${card.id}`}
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card.id)}
                        className={`group relative rounded-2xl p-4 select-none transition-all duration-200 hover:-translate-x-[1px] hover:-translate-y-[1px] ${cardBorder} active:cursor-grabbing cursor-grab ${palette.bg}`}
                      >
                        
                        {/* Interactive edit trigger on top right */}
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h4 className="font-display font-black text-slate-900 text-xs uppercase tracking-tight leading-snug line-clamp-2">
                            {card.title || 'Untitled note'}
                          </h4>
                          <button
                            id={`edit-card-${card.id}`}
                            onClick={() => onEditCard(card)}
                            className="p-1 rounded-md bg-white/40 border border-slate-900/10 text-slate-800 opacity-60 group-hover:opacity-100 hover:text-slate-900 hover:bg-slate-200/50 transition-all flex-shrink-0 cursor-pointer"
                            title="Edit this note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Note bulk content */}
                        <p className="text-[11px] text-slate-800 font-medium leading-relaxed line-clamp-4 whitespace-pre-wrap font-sans">
                          {card.content}
                        </p>

                        {/* Interactive controller block (Touch/Click helpful actions) */}
                        <div className="flex items-center justify-between border-t border-slate-900/10 mt-3 pt-2.5">
                          <span className="text-[9px] font-mono font-bold uppercase text-slate-500 tracking-wider bg-white/40 px-1 py-0.5 rounded border border-slate-900/5">
                            {new Date(card.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>

                          {/* Quick shifts for responsive users */}
                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            {!isFirstCol && (
                              <button
                                id={`move-card-left-${card.id}`}
                                onClick={() => handleShiftCategory(card, 'left')}
                                className="p-1 hover:bg-slate-200/50 rounded-md text-slate-800 transition cursor-pointer"
                                title="Move Left"
                              >
                                <MoveLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              id={`card-trash-${card.id}`}
                              onClick={() => onDeleteCard(card.id)}
                              className="p-1 hover:bg-rose-105 text-slate-700 hover:text-rose-650 rounded-md transition cursor-pointer"
                              title="Discard"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            {!isLastCol && (
                              <button
                                id={`move-card-right-${card.id}`}
                                onClick={() => handleShiftCategory(card, 'right')}
                                className="p-1 hover:bg-slate-200/50 rounded-md text-slate-800 transition cursor-pointer"
                                title="Move Right"
                              >
                                <MoveRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
