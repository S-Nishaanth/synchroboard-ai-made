import { TimetableEvent, IdeaCard, BoardColumn } from '../types';

export const COLOR_PALETTES = [
  { id: 'sky', name: 'Ocean Sky', bg: 'bg-[#E0F2FE] border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]', badge: 'bg-[#BAE6FD] text-slate-900 border-2 border-slate-900', dot: 'bg-sky-500 border border-slate-900', button: 'bg-sky-500 hover:bg-sky-600 border-2 border-slate-900 text-white' },
  { id: 'emerald', name: 'Mint Meadow', bg: 'bg-[#D1FAE5] border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]', badge: 'bg-[#A7F3D0] text-slate-900 border-2 border-slate-900', dot: 'bg-emerald-500 border border-slate-900', button: 'bg-emerald-500 hover:bg-emerald-600 border-2 border-slate-900 text-white' },
  { id: 'violet', name: 'Lavender Mist', bg: 'bg-[#F5F3FF] border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]', badge: 'bg-[#DDD6FE] text-slate-900 border-2 border-slate-900', dot: 'bg-violet-500 border border-slate-900', button: 'bg-violet-500 hover:bg-violet-600 border-2 border-slate-900 text-white' },
  { id: 'rose', name: 'Rose Petal', bg: 'bg-[#FFE4E6] border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]', badge: 'bg-[#FECDD3] text-slate-900 border-2 border-slate-900', dot: 'bg-rose-500 border border-slate-900', button: 'bg-rose-500 hover:bg-rose-600 border-2 border-slate-900 text-white' },
  { id: 'amber', name: 'Warm Amber', bg: 'bg-[#FEF3C7] border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]', badge: 'bg-[#FDE68A] text-slate-900 border-2 border-slate-900', dot: 'bg-amber-500 border border-slate-900', button: 'bg-amber-500 hover:bg-amber-600 border-2 border-slate-900 text-slate-900' },
  { id: 'indigo', name: 'Indigo Night', bg: 'bg-[#E0E7FF] border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]', badge: 'bg-[#C7D2FE] text-slate-900 border-2 border-slate-900', dot: 'bg-indigo-500 border border-slate-900', button: 'bg-indigo-500 hover:bg-indigo-600 border-2 border-slate-900 text-white' },
];

export const INITIAL_COLUMNS: BoardColumn[] = [
  { id: 'backlog', title: 'Brainstorm & Backlog', color: 'bg-sky-500' },
  { id: 'research', title: 'Research & Sketching', color: 'bg-violet-500' },
  { id: 'doing', title: 'Work In Progress', color: 'bg-amber-500' },
  { id: 'completed', title: 'Finished / Implemented', color: 'bg-emerald-500' },
];

export const INITIAL_EVENTS: TimetableEvent[] = [
  {
    id: 'e1',
    name: 'Morning Creativity & Focus',
    day: 'Monday',
    startTime: '09:00',
    endTime: '11:00',
    color: 'violet',
    description: 'Deep work on illustration sketches and moodboard layout.',
    location: 'Home Studio'
  },
  {
    id: 'e2',
    name: 'Sync & Collaboration',
    day: 'Monday',
    startTime: '13:00',
    endTime: '14:30',
    color: 'sky',
    description: 'Review product designs and gather team inputs.',
    location: 'Meeting Room A'
  },
  {
    id: 'e3',
    name: 'UI Prototyping Workshop',
    day: 'Tuesday',
    startTime: '10:00',
    endTime: '12:00',
    color: 'emerald',
    description: 'Fiddle with animation primitives and interactive components.',
    location: 'Lab Room'
  },
  {
    id: 'e4',
    name: 'Design System & Specs',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '16:00',
    color: 'indigo',
    description: 'Draft the guidelines for our new product catalog.',
    location: 'Quiet Office'
  },
  {
    id: 'e5',
    name: 'Interactive Review Session',
    day: 'Thursday',
    startTime: '11:00',
    endTime: '12:30',
    color: 'rose',
    description: 'Walk through dynamic prototype, gather usability feedback.',
    location: 'Review Deck'
  },
  {
    id: 'e6',
    name: 'Relaxed Retro & Planning',
    day: 'Friday',
    startTime: '15:00',
    endTime: '16:30',
    color: 'amber',
    description: 'Celebrate wins, list items to focus on next week.',
    location: 'Cafe Lounge'
  }
];

export const INITIAL_IDEAS: IdeaCard[] = [
  {
    id: 'i1',
    title: 'Haptic Feedback Design',
    content: 'Integrate custom feedback patterns on touch gestures so the app feels mechanical and ultra-tactile.',
    category: 'backlog',
    color: 'sky',
    createdAt: Date.now() - 3600000 * 24 * 3
  },
  {
    id: 'i2',
    title: 'Bento Grid Portfolio',
    content: 'Rebuild personal details layout with fully custom responsive bento cells. Accent with subtle neon inner glows.',
    category: 'research',
    color: 'violet',
    createdAt: Date.now() - 3600000 * 24
  },
  {
    id: 'i3',
    title: 'Warm Slate Dark Concept',
    content: 'Explore combining #1E2022 slate gray together with an amber accent text (#F59E0B) for dynamic night reading.',
    category: 'doing',
    color: 'amber',
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'i4',
    title: 'Responsive Custom Forms',
    content: 'Completed adding accessible aria-labels, touch-friendly input fields and custom drop-down controls.',
    category: 'completed',
    color: 'emerald',
    createdAt: Date.now() - 3600000 * 12
  }
];
