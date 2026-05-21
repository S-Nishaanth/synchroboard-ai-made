import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Lightbulb,
  Download,
  Upload,
  RefreshCw,
  Plus,
  HelpCircle,
  FileCheck,
  CheckCircle,
  CalendarRange,
  Sun,
  Moon,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { TimetableEvent, IdeaCard, DayOfWeek } from './types';
import {
  INITIAL_EVENTS,
  INITIAL_IDEAS,
  INITIAL_COLUMNS
} from './data/initialData';
import TimetableGrid from './components/TimetableGrid';
import EventDialog from './components/EventDialog';
import IdeaBoard from './components/IdeaBoard';
import IdeaDialog from './components/IdeaDialog';

export default function App() {
  // User Theme preference selection (Light, Dark, High-Contrast/Stark)
  const [theme, setTheme] = useState<'light' | 'dark' | 'contrast'>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved as any) || 'light';
  });

  // Main workspaces state loaded with localStorage fallback
  const [events, setEvents] = useState<TimetableEvent[]>(() => {
    const stored = localStorage.getItem('timetable_events');
    return stored ? JSON.parse(stored) : INITIAL_EVENTS;
  });

  const [ideas, setIdeas] = useState<IdeaCard[]>(() => {
    const stored = localStorage.getItem('timetable_ideas');
    return stored ? JSON.parse(stored) : INITIAL_IDEAS;
  });

  // Save changes to localstorage on updates
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const [showHeader, setShowHeader] = useState<boolean>(() => {
    const saved = localStorage.getItem('app_show_header');
    return saved !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('app_show_header', String(showHeader));
  }, [showHeader]);

  // Current view dashboard state
  const [activeTab, setActiveTab] = useState<'scheduler' | 'board'>('scheduler');
  const [showQuickTips, setShowQuickTips] = useState(true);

  // Event modal state
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<TimetableEvent | null>(null);
  const [defaultDayForNewEvent, setDefaultDayForNewEvent] = useState<DayOfWeek | undefined>(undefined);
  const [defaultTimeForNewEvent, setDefaultTimeForNewEvent] = useState<string | undefined>(undefined);

  // Idea sticky note modals state
  const [isIdeaDialogOpen, setIsIdeaDialogOpen] = useState(false);
  const [ideaToEdit, setIdeaToEdit] = useState<IdeaCard | null>(null);
  const [defaultCategoryForNewIdea, setDefaultCategoryForNewIdea] = useState<string | undefined>(undefined);

  // Notification notification messages
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Save changes to localstorage on updates
  useEffect(() => {
    localStorage.setItem('timetable_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('timetable_ideas', JSON.stringify(ideas));
  }, [ideas]);

  const triggerNotice = (message: string, type: 'success' | 'info' = 'success') => {
    setNotice({ message, type });
    const timer = setTimeout(() => {
      setNotice(null);
    }, 4000);
    return () => clearTimeout(timer);
  };

  // --- Scheduler Event Handlers ---
  const handleOpenAddEvent = (day?: DayOfWeek, time?: string) => {
    setEventToEdit(null);
    setDefaultDayForNewEvent(day);
    setDefaultTimeForNewEvent(time);
    setIsEventDialogOpen(true);
  };

  const handleOpenEditEvent = (event: TimetableEvent) => {
    setEventToEdit(event);
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<TimetableEvent, 'id'> & { id?: string }) => {
    if (eventData.id) {
      // Editing
      setEvents((prev) =>
        prev.map((e) => (e.id === eventData.id ? (eventData as TimetableEvent) : e))
      );
      triggerNotice('Schedule block was successfully updated');
    } else {
      // Creation
      const newEvent: TimetableEvent = {
        ...eventData,
        id: `event-${Date.now()}`
      } as TimetableEvent;
      setEvents((prev) => [...prev, newEvent]);
      triggerNotice('New block added to weekly timetable');
    }
    setIsEventDialogOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setIsEventDialogOpen(false);
    triggerNotice('Block was removed from timetable', 'info');
  };

  const handleUpdateEventDateTime = (id: string, day: DayOfWeek, startTime: string, endTime: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, day, startTime, endTime } : e))
    );
    triggerNotice('Re-scheduled block to ' + day + ' at ' + startTime);
  };

  // --- Idea Board Handlers ---
  const handleOpenAddIdea = (category?: string) => {
    setIdeaToEdit(null);
    setDefaultCategoryForNewIdea(category);
    setIsIdeaDialogOpen(true);
  };

  const handleOpenEditIdea = (card: IdeaCard) => {
    setIdeaToEdit(card);
    setIsIdeaDialogOpen(true);
  };

  const handleSaveIdea = (ideaData: Omit<IdeaCard, 'id' | 'createdAt'> & { id?: string }) => {
    if (ideaData.id) {
      // Edit
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === ideaData.id
            ? { ...i, ...ideaData }
            : i
        )
      );
      triggerNotice('Idea card was successfully saved');
    } else {
      // Create
      const newIdea: IdeaCard = {
        title: ideaData.title,
        content: ideaData.content,
        category: ideaData.category,
        color: ideaData.color,
        id: `idea-${Date.now()}`,
        createdAt: Date.now()
      };
      setIdeas((prev) => [...prev, newIdea]);
      triggerNotice('New sticky card pinned to idea board');
    }
    setIsIdeaDialogOpen(false);
  };

  const handleUpdateIdeaCategory = (cardId: string, newCategory: string) => {
    setIdeas((prev) =>
      prev.map((idv) => (idv.id === cardId ? { ...idv, category: newCategory } : idv))
    );
  };

  const handleDeleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    setIsIdeaDialogOpen(false);
    triggerNotice('Idea card deleted', 'info');
  };

  // --- Workspace management controls ---
  const handleResetWorkspace = () => {
    if (window.confirm('Wipe timetable and idea boards back to preconfigured defaults? This overwrites dynamic data.')) {
      setEvents(INITIAL_EVENTS);
      setIdeas(INITIAL_IDEAS);
      triggerNotice('Workspace has been reset successfully to creative defaults', 'info');
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      events,
      ideas,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workspace_backup_${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    triggerNotice('Workspace file download initiated successfully!');
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.events) && Array.isArray(parsed.ideas)) {
          setEvents(parsed.events);
          setIdeas(parsed.ideas);
          triggerNotice('Workspace custom data imported successfully!', 'success');
        } else {
          alert('Invalid file format. Ensure events and ideas lists are current.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON. Please check file structure.');
      }
    };
    reader.readAsText(file);
    // clear input
    e.target.value = '';
  };

  const getThemeContainerClass = () => {
    if (theme === 'dark') {
      return 'min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-indigo-900 selection:text-indigo-200 pb-16 transition-colors duration-200';
    } else if (theme === 'contrast') {
      return 'min-h-screen bg-[#FFFBEB] text-black font-sans selection:bg-yellow-250 selection:text-black pb-16 transition-colors duration-200';
    }
    return 'min-h-screen bg-[#F9FAFB] text-slate-900 font-sans selection:bg-indigo-150 selection:text-indigo-950 pb-16 transition-colors duration-200';
  };

  const headerClass = theme === 'dark' 
    ? 'sticky top-0 z-40 bg-[#1E293B] border-b-4 border-indigo-500 shadow-lg'
    : theme === 'contrast'
    ? 'sticky top-0 z-40 bg-white border-b-8 border-black'
    : 'sticky top-0 z-40 bg-white border-b-4 border-slate-900';

  const logoTextClass = theme === 'dark'
    ? 'font-display text-2xl font-black tracking-tighter uppercase text-slate-100'
    : 'font-display text-2xl font-black tracking-tighter uppercase text-slate-900';

  const subLogoTextClass = theme === 'dark'
    ? 'text-slate-400'
    : 'text-slate-500';

  const navTabClass = theme === 'dark'
    ? 'flex items-center bg-[#0F172A] border-2 border-indigo-500 p-1 rounded-xl shadow-[2px_2px_0px_0px_rgba(99,102,241,0.5)]'
    : theme === 'contrast'
    ? 'flex items-center bg-white border-4 border-black p-1 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
    : 'flex items-center bg-slate-100 border-2 border-slate-900 p-1 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]';

  const headerBtnClass = theme === 'dark'
    ? 'px-4 py-2 border-2 border-indigo-500 bg-[#1E293B] hover:bg-[#334155] text-slate-100 rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(99,102,241,0.4)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5'
    : theme === 'contrast'
    ? 'px-4 py-2 border-4 border-black bg-white hover:bg-yellow-105 text-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5'
    : 'px-4 py-2 border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5';

  const resetBtnClass = theme === 'dark'
    ? 'p-2 border-2 border-indigo-500 bg-[#1E293B] hover:bg-rose-950 hover:text-rose-400 text-slate-250 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_rgba(99,102,241,0.4)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all'
    : theme === 'contrast'
    ? 'p-2 border-4 border-black bg-white hover:bg-red-400 hover:text-black text-black rounded-xl text-xs font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all'
    : 'p-2 border-2 border-slate-900 bg-white hover:bg-rose-100 hover:text-rose-600 text-slate-900 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all';

  return (
    <div className={getThemeContainerClass()}>
      
      {/* Top Main Brand Header */}
      {showHeader && (
        <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo Title & Static Status */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border-2 shadow-[3px_3px_0px_0px_rgba(99,102,241,1)] ${
              theme === 'dark' ? 'bg-slate-900 text-white border-indigo-500' : theme === 'contrast' ? 'bg-white text-black border-black' : 'bg-slate-900 text-white border-slate-900'
            }`}>
              <CalendarRange className="w-5 h-5 text-indigo-400 hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className={logoTextClass}>
                Syncro / <span className={`${theme === 'contrast' ? 'underline bg-yellow-200 px-1' : 'text-indigo-600'}`}>Board</span>
              </h1>
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mt-0.5 ${subLogoTextClass}`}>
                <span>Workspace Hub</span>
                <span>•</span>
                <span className={`font-mono ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {events.length} schedule blocks | {ideas.length} ideas
                </span>
              </div>
            </div>
          </div>

          {/* Theme Quick Switcher Component */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border-2 ${
            theme === 'dark' ? 'bg-[#0F172A] border-indigo-500 shadow-[2px_2px_0px_0px_rgba(129,140,248,0.5)]' : theme === 'contrast' ? 'bg-white border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-slate-100 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
          }`}>
            <button
              id="theme-light-btn"
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-300 text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-205/30'
              }`}
              title="Switch to Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">Light</span>
            </button>
            <button
              id="theme-dark-btn"
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-indigo-600 text-white border-2 border-indigo-450 shadow-[1px_1px_0px_0px_rgba(99,102,241,0.5)]'
                  : 'text-slate-500 hover:text-[#CCC] hover:bg-slate-800'
              }`}
              title="Switch to Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">Dark</span>
            </button>
            <button
              id="theme-contrast-btn"
              onClick={() => setTheme('contrast')}
              className={`p-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                theme === 'contrast'
                  ? 'bg-[#FDE047] text-black border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-slate-500 hover:text-black hover:bg-yellow-100'
              }`}
              title="Switch to Stark Contrast Theme"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">Stark</span>
            </button>
          </div>

          {/* Core Navigation tabs */}
          <div className={navTabClass}>
            <button
              id="tab-timetable-trigger"
              onClick={() => setActiveTab('scheduler')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'scheduler'
                  ? theme === 'dark'
                    ? 'bg-indigo-600 text-white border-2 border-indigo-400 shadow-[2px_2px_0px_0px_rgba(129,140,248,0.5)]'
                    : theme === 'contrast'
                    ? 'bg-[#FDE047] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-indigo-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-650 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Weekly Schedule
            </button>
            <button
              id="tab-ideas-trigger"
              onClick={() => setActiveTab('board')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'board'
                  ? theme === 'dark'
                    ? 'bg-indigo-600 text-white border-2 border-indigo-400 shadow-[2px_2px_0px_0px_rgba(129,140,248,0.5)]'
                    : theme === 'contrast'
                    ? 'bg-[#FDE047] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-indigo-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-650 hover:text-slate-900'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Idea Board
            </button>
          </div>

          {/* Backup Storage & Reset Tool Actions */}
          <div className="flex items-center gap-2">
            <button
              id="export-workspace-btn"
              onClick={handleExportBackup}
              className={headerBtnClass}
              title="Download backup file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Backup</span>
            </button>
            
            <label
              id="import-workspace-label"
              className={headerBtnClass}
              title="Restore content from a backup file"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import</span>
              <input
                id="file-import-hidden"
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            <button
              id="reset-workspace-btn"
              onClick={handleResetWorkspace}
              className={resetBtnClass}
              title="Clear all data and load defaults"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              id="hide-header-btn"
              onClick={() => {
                setShowHeader(false);
                triggerNotice('Top bar was hidden. Use the floating menu to toggle back on.');
              }}
              className={resetBtnClass}
              title="Minimize/Hide Top Bar"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>
      )}

      {/* Floating Zen Mode controls when header is hidden */}
      {!showHeader && (
        <div 
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full border-2 shadow-xl backdrop-blur-md transition-all scale-100 hover:scale-[1.02]"
          style={{
            borderColor: theme === 'dark' ? '#6366F1' : theme === 'contrast' ? '#000000' : '#0F172A',
            backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : theme === 'contrast' ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.95)',
            color: theme === 'dark' ? '#F1F5F9' : '#0F172A',
            borderWidth: theme === 'contrast' ? '4px' : '2px',
            boxShadow: theme === 'dark' ? '3px 3px 0px 0px rgba(99,102,241,0.4)' : theme === 'contrast' ? '4px 4px 0px 0px rgba(0,0,0,1)' : '3px 3px 0px 0px rgba(15,23,42,1)',
          }}
        >
          {/* Schedule trigger */}
          <button
            onClick={() => setActiveTab('scheduler')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'scheduler'
                ? theme === 'dark'
                  ? 'bg-indigo-600 text-white'
                  : theme === 'contrast'
                  ? 'bg-yellow-300 text-black border-2 border-black'
                  : 'bg-slate-900 text-white'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>

          {/* Ideas trigger */}
          <button
            onClick={() => setActiveTab('board')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'board'
                ? theme === 'dark'
                  ? 'bg-indigo-600 text-white'
                  : theme === 'contrast'
                  ? 'bg-yellow-300 text-black border-2 border-black'
                  : 'bg-slate-900 text-white'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Ideas</span>
          </button>

          <div className={`h-4 w-[1px] ${theme === 'dark' ? 'bg-indigo-500/30' : theme === 'contrast' ? 'bg-black/35' : 'bg-slate-300'}`} />

          {/* Show header trigger */}
          <button
            onClick={() => setShowHeader(true)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#0F172A] border border-indigo-500 text-indigo-400 hover:bg-slate-800 shadow-[1px_1px_0px_0px_rgba(99,102,241,0.4)]'
                : theme === 'contrast'
                ? 'bg-[#FDE047] border-2 border-black hover:bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-slate-100 border border-slate-900 hover:bg-slate-200 text-slate-800 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]'
            }`}
            title="Restore Top Bar Menu"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Show Bar</span>
          </button>
        </div>
      )}

      {/* Main Workspace Frame container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Dynamic trigger notice banner - Styled as a fixed bottom-right toast to remain visible regardless of header toggle state */}
        {notice && (
          <div 
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border-2 font-bold flex items-center gap-2.5 text-sm transition-all duration-300 max-w-sm shadow-xl ${
              theme === 'dark'
                ? 'bg-emerald-500 text-slate-900 border-indigo-500 shadow-[4px_4px_0px_0px_rgba(99,102,241,0.5)]'
                : theme === 'contrast'
                ? 'bg-[#FDE047] text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-[#34D399] text-gray-900 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
            }`}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="uppercase tracking-wider font-black text-xs">{notice.message}</span>
          </div>
        )}

        {/* Info box with user-facing guides */}
        {showQuickTips && (
          <div className="mb-6 p-6 rounded-3xl bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
            <div className="absolute right-4 top-4">
              <button
                id="close-tips-btn"
                onClick={() => setShowQuickTips(false)}
                className="text-xs font-black uppercase tracking-widest text-[#FFF] bg-slate-900 hover:bg-indigo-650 px-3 py-1.5 border border-slate-900 rounded-xl transition cursor-pointer"
              >
                Hide
              </button>
            </div>
            <div className="flex gap-4">
              <HelpCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">Workspace Customization Guide</h2>
                <div className="mt-3 text-xs text-slate-700 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#FEF3C7] p-3 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <span className="font-black text-slate-900 uppercase tracking-wider block mb-1">📅 Weekly Timetable</span>
                    <ul className="list-disc pl-4 space-y-1 font-semibold text-slate-800">
                      <li>Click any cell grid directly to draft schedule blocks.</li>
                      <li>Adjust Grid Range dynamically with the selector tool.</li>
                    </ul>
                  </div>
                  <div className="bg-[#E0E7FF] p-3 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <span className="font-black text-slate-900 uppercase tracking-wider block mb-1">💡 Brainstorm Board</span>
                    <ul className="list-disc pl-4 space-y-1 font-semibold text-slate-800">
                      <li>Fully draggable cards to move tasks between stages.</li>
                      <li>Interactive color filters and query search.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Layout components Switcher */}
        {activeTab === 'scheduler' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-display font-black text-xl uppercase tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-950'}`}>Weekly Timetable</h3>
                <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Visualize your blocks, sync agendas and stay organized throughout the week</p>
              </div>
              <button
                id="header-add-event-btn"
                onClick={() => handleOpenAddEvent()}
                className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500 shadow-[4px_4px_0px_0px_rgba(129,140,248,0.3)]'
                    : theme === 'contrast'
                    ? 'bg-white text-black border-4 border-black hover:bg-yellow-105 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.35)]'
                }`}
              >
                <Plus className="w-4 h-4" /> Add Slot
              </button>
            </div>

            <TimetableGrid
              events={events}
              onAddEvent={handleOpenAddEvent}
              onEditEvent={handleOpenEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onUpdateEventDateTime={handleUpdateEventDateTime}
              theme={theme}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-display font-black text-xl uppercase tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-950'}`}>Productivity Board</h3>
                <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Pin plans, resource links, and sticky thoughts on the board</p>
              </div>
              <button
                id="header-add-idea-btn"
                onClick={() => handleOpenAddIdea()}
                className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500 shadow-[4px_4px_0px_0px_rgba(129,140,248,0.3)]'
                    : theme === 'contrast'
                    ? 'bg-white text-black border-4 border-black hover:bg-yellow-105 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-indigo-650 text-white hover:bg-indigo-600 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
                }`}
              >
                <Plus className="w-4 h-4" /> Pin New Idea
              </button>
            </div>

            <IdeaBoard
              cards={ideas}
              columns={INITIAL_COLUMNS}
              onAddCard={handleOpenAddIdea}
              onEditCard={handleOpenEditIdea}
              onUpdateCardCategory={handleUpdateIdeaCategory}
              onDeleteCard={handleDeleteIdea}
              theme={theme}
            />
          </div>
        )}

      </main>

      {/* --- Overlay Modals & Dialog Portals --- */}
      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        eventToEdit={eventToEdit}
        defaultDay={defaultDayForNewEvent}
        defaultTime={defaultTimeForNewEvent}
        theme={theme}
      />

      <IdeaDialog
        isOpen={isIdeaDialogOpen}
        onClose={() => setIsIdeaDialogOpen(false)}
        onSave={handleSaveIdea}
        onDelete={handleDeleteIdea}
        cardToEdit={ideaToEdit}
        columns={INITIAL_COLUMNS}
        defaultCategory={defaultCategoryForNewIdea}
        theme={theme}
      />

    </div>
  );
}
