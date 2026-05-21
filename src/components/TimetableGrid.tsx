import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Clock, MapPin, ZoomIn, ZoomOut, Settings2, Trash2 } from 'lucide-react';
import { TimetableEvent, DayOfWeek } from '../types';
import { COLOR_PALETTES } from '../data/initialData';

interface TimetableGridProps {
  events: TimetableEvent[];
  onAddEvent: (day?: DayOfWeek, time?: string) => void;
  onEditEvent: (event: TimetableEvent) => void;
  onDeleteEvent: (id: string) => void;
  onUpdateEventDateTime: (id: string, day: DayOfWeek, startTime: string, endTime: string) => void;
  theme: 'light' | 'dark' | 'contrast';
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimetableGrid({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onUpdateEventDateTime,
  theme
}: TimetableGridProps) {
  // Drag over states for visual feedback
  const [dragOverCell, setDragOverCell] = useState<{ day: DayOfWeek; hr: number } | null>(null);
  // Configurable Start & End Hours
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(20);
  const [hourHeight, setHourHeight] = useState(64); // PX per hour, customizable with zoom controls
  const [mobileSingleDay, setMobileSingleDay] = useState<DayOfWeek | 'All'>('All');

  // Track current system day and time for current-time pointer
  const [currentTime, setCurrentTime] = useState<{ day: string; ratio: number; visible: boolean }>({
    day: '',
    ratio: 0,
    visible: false
  });

  useEffect(() => {
    const updateTimeIndicator = () => {
      const now = new Date();
      // Map getDay() 0=Sunday, 1=Monday... to our day list
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const activeDayName = dayNames[now.getDay()];
      
      const hours = now.getHours();
      const mins = now.getMinutes();
      const decimalTime = hours + mins / 60;

      if (decimalTime >= startHour && decimalTime <= endHour) {
        // Calculate ratio: how far down the timetable the line is
        const ratio = (decimalTime - startHour) / (endHour - startHour);
        setCurrentTime({
          day: activeDayName,
          ratio,
          visible: true
        });
      } else {
        setCurrentTime(prev => ({ ...prev, visible: false }));
      }
    };

    updateTimeIndicator();
    const interval = setInterval(updateTimeIndicator, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [startHour, endHour]);

  const hoursArray = useMemo(() => {
    const arr = [];
    for (let h = startHour; h <= endHour; h++) {
      arr.push(h);
    }
    return arr;
  }, [startHour, endHour]);

  // Helper: Converts "HH:MM" into decimal hours relative to startHour
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const getEventPosition = (event: TimetableEvent) => {
    const startMins = timeToMinutes(event.startTime);
    const endMins = timeToMinutes(event.endTime);
    const gridStartMins = startHour * 60;
    const gridEndMins = endHour * 60;

    // Crop events to grid boundaries
    const activeStartMins = Math.max(startMins, gridStartMins);
    const activeEndMins = Math.min(endMins, gridEndMins);

    if (activeStartMins >= gridEndMins || activeEndMins <= gridStartMins) {
      return null; // outside range
    }

    const minutesDuration = activeEndMins - activeStartMins;
    const minutesFromStart = activeStartMins - gridStartMins;

    const top = (minutesFromStart / 60) * hourHeight;
    const height = (minutesDuration / 60) * hourHeight;

    return { top, height };
  };

  const handleCellClick = (day: DayOfWeek, hr: number) => {
    const formatTime = `${hr.toString().padStart(2, '0')}:00`;
    onAddEvent(day, formatTime);
  };

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData('text/plain', eventId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const containerClass = theme === 'dark'
    ? 'bg-[#131C30] rounded-3xl border-2 border-indigo-500 shadow-[6px_6px_0px_0px_rgba(99,102,241,0.4)] overflow-hidden transition-colors duration-200'
    : theme === 'contrast'
    ? 'bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden'
    : 'bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] overflow-hidden transition-colors duration-200';

  const controlPanelClass = theme === 'dark'
    ? 'border-b-2 border-indigo-500 bg-[#1E293B] p-4 flex flex-wrap gap-4 items-center justify-between text-sm text-slate-100'
    : theme === 'contrast'
    ? 'border-b-4 border-black bg-white p-4 flex flex-wrap gap-4 items-center justify-between text-sm text-black'
    : 'border-b-2 border-slate-900 bg-slate-50/50 p-4 flex flex-wrap gap-4 items-center justify-between text-sm text-slate-900';

  const settingsLabelClass = theme === 'dark'
    ? 'font-extrabold uppercase tracking-wider text-slate-100 flex items-center gap-1.5 text-xs'
    : theme === 'contrast'
    ? 'font-black uppercase tracking-wider text-black flex items-center gap-1.5 text-xs'
    : 'font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 text-xs';

  const selectClass = theme === 'dark'
    ? 'bg-[#0F172A] border-2 border-indigo-500 font-bold rounded-lg px-2.5 py-1 text-xs text-white focus:ring-2 focus:ring-indigo-400 outline-hidden cursor-pointer'
    : theme === 'contrast'
    ? 'bg-white border-2 border-black font-extrabold rounded-lg px-2.5 py-1 text-xs text-black focus:ring-4 focus:ring-black outline-hidden cursor-pointer'
    : 'bg-white border-2 border-slate-900 font-bold rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-hidden cursor-pointer';

  const textLabelClass = theme === 'dark'
    ? 'text-slate-400 font-extrabold uppercase text-xs'
    : theme === 'contrast'
    ? 'text-black font-black uppercase text-xs underline decoration-2'
    : 'text-slate-500 font-extrabold uppercase text-xs';

  const spacingBtnClass = theme === 'dark'
    ? 'p-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 border-2 border-indigo-500 shadow-[2px_2px_0px_0px_rgba(99,102,241,0.4)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex justify-center items-center'
    : theme === 'contrast'
    ? 'p-1.5 rounded-lg bg-white hover:bg-yellow-100 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex justify-center items-center'
    : 'p-1.5 rounded-lg bg-slate-100 hover:bg-slate-205 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex justify-center items-center';

  const spacingBtnIconClass = theme === 'dark' ? 'w-3.5 h-3.5 text-slate-150' : 'w-3.5 h-3.5 text-slate-900';

  const newBlockBtnClass = theme === 'dark'
    ? 'flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-505 text-white border-2 border-indigo-500 rounded-lg text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(99,102,241,0.4)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer'
    : theme === 'contrast'
    ? 'flex items-center gap-1.5 px-3 py-1.5 bg-[#FDE047] text-black hover:bg-[#FACC15] border-2 border-black rounded-lg text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer'
    : 'flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 border-2 border-slate-900 rounded-lg text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer';

  const mobileTabsClass = theme === 'dark'
    ? 'lg:hidden p-3 bg-[#0F172A] border-b-2 border-indigo-500 flex gap-1.5 overflow-x-auto scrollbar-none'
    : theme === 'contrast'
    ? 'lg:hidden p-3 bg-[#FFFBEB] border-b-4 border-black flex gap-1.5 overflow-x-auto scrollbar-none'
    : 'lg:hidden p-3 bg-slate-50 border-b-2 border-slate-900 flex gap-1.5 overflow-x-auto scrollbar-none';

  const mobileTabBtnClass = (dayKey: DayOfWeek | 'All') => {
    const isSelected = mobileSingleDay === dayKey;
    if (isSelected) {
      if (theme === 'dark') {
        return 'px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-indigo-400 bg-indigo-600 text-white shadow-sm cursor-pointer whitespace-nowrap';
      } else if (theme === 'contrast') {
        return 'px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-black bg-[#FDE047] text-black shadow-sm cursor-pointer whitespace-nowrap';
      } else {
        return 'px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-slate-900 bg-slate-900 text-white shadow-sm cursor-pointer whitespace-nowrap';
      }
    } else {
      if (theme === 'dark') {
        return 'px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-slate-700 bg-[#1E293B] text-slate-300 cursor-pointer whitespace-nowrap';
      } else if (theme === 'contrast') {
        return 'px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-black bg-white text-black cursor-pointer whitespace-nowrap';
      } else {
        return 'px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-slate-300 bg-slate-100 text-slate-700 cursor-pointer whitespace-nowrap';
      }
    }
  };

  return (
    <div className={containerClass}>
      {/* Control panel for Grid Parameters */}
      <div className={controlPanelClass}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={settingsLabelClass}>
            <Settings2 className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-405' : theme === 'contrast' ? 'text-black' : 'text-indigo-600'}`} /> Grid Range:
          </span>
          <div className="flex items-center gap-1.5">
            <select
              id="grid-start-hour-select"
              value={startHour}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < endHour) setStartHour(val);
              }}
              className={selectClass}
            >
              {[...Array(24).keys()].map(h => (
                <option key={h} value={h}>{`${h.toString().padStart(2, '0')}:00`}</option>
              ))}
            </select>
            <span className={textLabelClass}>to</span>
            <select
              id="grid-end-hour-select"
              value={endHour}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > startHour) setEndHour(val);
              }}
              className={selectClass}
            >
              {[...Array(24).keys()].map(h => (
                <option key={h} value={h}>{`${h.toString().padStart(2, '0')}:00`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Zoom scale / height adjusting controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r-2 border-slate-900 pr-4">
            <span className={textLabelClass}>Spacing</span>
            <button
              id="zoom-out-btn"
              onClick={() => setHourHeight((prev: number) => Math.max(48, prev - 8))}
              className={spacingBtnClass}
              title="Decrease cell height"
            >
              <ZoomOut className={spacingBtnIconClass} />
            </button>
            <button
              id="zoom-in-btn"
              onClick={() => setHourHeight((prev: number) => Math.min(120, prev + 8))}
              className={spacingBtnClass}
              title="Increase cell height"
            >
              <ZoomIn className={spacingBtnIconClass} />
            </button>
          </div>

          <button
            id="timetable-add-direct"
            onClick={() => onAddEvent()}
            className={newBlockBtnClass}
          >
            <Plus className="w-3.5 h-3.5" /> New Block
          </button>
        </div>
      </div>

      {/* Week day filters strictly for mini-screens (Mobile responsiveness) */}
      <div className={mobileTabsClass}>
        <button
          id="day-tab-all"
          onClick={() => setMobileSingleDay('All')}
          className={mobileTabBtnClass('All')}
        >
          Weekly Matrix
        </button>
        {DAYS.map((d) => (
          <button
            id={`day-tab-${d.toLowerCase()}`}
            key={d}
            onClick={() => setMobileSingleDay(d)}
            className={mobileTabBtnClass(d)}
          >
            {d.substring(0, 3)}
          </button>
        ))}
      </div>

      {/* Grid Canvas Wrapper */}
      <div className={`overflow-x-auto scrollbar-thin ${theme === 'dark' ? 'bg-[#0F172A]/40' : theme === 'contrast' ? 'bg-[#FFFBEB]' : 'bg-slate-50/20'}`}>
        {/* Min width ensures calendar is usable even when loaded on smaller viewports */}
        <div className="min-w-[800px] lg:min-w-0 grid grid-cols-[64px_1fr] relative">
          
          {/* Hour Labels Column */}
          <div className={`border-r-2 select-none relative ${
            theme === 'dark' ? 'border-indigo-500 bg-[#1E293B]/40' : theme === 'contrast' ? 'border-r-4 border-black bg-white text-black font-extrabold' : 'border-slate-900 bg-slate-50/60'
          }`}>
            {/* Top corner placeholder spacer */}
            <div className={`h-10 ${theme === 'dark' ? 'border-b-2 border-indigo-500' : theme === 'contrast' ? 'border-b-4 border-black' : 'border-b-2 border-slate-900'}`} />
            
            <div className="relative" style={{ height: `${(hoursArray.length - 1) * hourHeight}px` }}>
              {hoursArray.map((hr, idx) => (
                <div
                  key={hr}
                  className={`text-[10px] font-mono font-bold text-right pr-2 absolute right-0 w-full h-0 flex items-center justify-end ${
                    theme === 'dark' ? 'text-slate-400' : theme === 'contrast' ? 'text-black' : 'text-slate-500'
                  }`}
                  style={{ 
                    top: `${idx * hourHeight}px`,
                  }}
                >
                  <span className="leading-none select-none translate-y-[-0.5px]">{`${hr.toString().padStart(2, '0')}:00`}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Days Columns */}
          <div className={`grid ${mobileSingleDay === 'All' ? 'grid-cols-7' : 'grid-cols-1'} relative`}>
            
            {/* Day Header row */}
            {DAYS.filter(d => mobileSingleDay === 'All' || mobileSingleDay === d).map((day) => (
              <div
                key={day}
                className={
                  theme === 'dark'
                    ? 'text-center h-10 border-b-2 border-indigo-500 text-xs font-black uppercase tracking-wider text-slate-200 bg-[#1E293B] flex flex-col items-center justify-center border-r-2 border-indigo-500 last:border-r-0'
                    : theme === 'contrast'
                    ? 'text-center h-10 border-b-4 border-black text-xs font-black uppercase tracking-wider text-black bg-yellow-300 flex flex-col items-center justify-center border-r-4 border-black last:border-r-0'
                    : 'text-center h-10 border-b-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-900 bg-slate-50 flex flex-col items-center justify-center border-r-2 border-slate-900 last:border-r-0'
                }
              >
                <span className="truncate px-1" title={day}>{day}</span>
              </div>
            ))}

            {/* Timetable Body Cells and Events Canvas */}
            <div className={`col-span-full relative`} style={{ height: `${(hoursArray.length - 1) * hourHeight}px` }}>
              
              {/* Vertical Column guides */}
              <div className={`absolute inset-0 grid ${mobileSingleDay === 'All' ? 'grid-cols-7' : 'grid-cols-1'} pointer-events-none`}>
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className={`border-r last:border-r-0 h-full ${
                      theme === 'dark' ? 'border-dashed border-slate-800' : theme === 'contrast' ? 'border-dashed border-black/30' : 'border-dashed border-slate-200'
                    } ${
                      mobileSingleDay !== 'All' && mobileSingleDay !== day ? 'hidden' : ''
                    }`}
                  />
                ))}
              </div>

              {/* Horizontal Hour rows */}
              <div className="absolute inset-x-0 inset-y-0 flex flex-col pointer-events-none">
                {hoursArray.slice(0, -1).map((hr) => (
                  <div
                    key={hr}
                    className={`border-b ${
                      theme === 'dark' ? 'border-dashed border-slate-800' : theme === 'contrast' ? 'border-dashed border-black/30' : 'border-dashed border-slate-200'
                    } w-full`}
                    style={{ height: `${hourHeight}px` }}
                  />
                ))}
              </div>

              {/* Clickable background cells to add events easily & Droppable fields */}
              <div className={`absolute inset-0 grid ${mobileSingleDay === 'All' ? 'grid-cols-7' : 'grid-cols-1'}`}>
                {DAYS.map((day) => {
                  const hideColumn = mobileSingleDay !== 'All' && mobileSingleDay !== day;
                  return (
                    <div key={day} className={`h-full relative flex flex-col ${hideColumn ? 'hidden' : ''}`}>
                      {hoursArray.slice(0, -1).map((hr) => {
                        const isDragOver = dragOverCell?.day === day && dragOverCell?.hr === hr;
                        return (
                          <div
                            key={hr}
                            onClick={() => handleCellClick(day, hr)}
                            onDragOver={(e) => {
                              e.preventDefault();
                              if (dragOverCell?.day !== day || dragOverCell?.hr !== hr) {
                                setDragOverCell({ day, hr });
                              }
                            }}
                            onDragLeave={() => {
                              setDragOverCell(null);
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              const eventId = e.dataTransfer.getData('text/plain');
                              if (eventId) {
                                const ev = events.find((item) => item.id === eventId);
                                if (ev) {
                                  const startMins = timeToMinutes(ev.startTime);
                                  const endMins = timeToMinutes(ev.endTime);
                                  const durationMins = endMins - startMins;

                                  const startHourStr = hr.toString().padStart(2, '0');
                                  const startMinStr = '00';
                                  const newStartTimeStr = `${startHourStr}:${startMinStr}`;

                                  const endTotalMins = hr * 60 + durationMins;
                                  const endHrRaw = Math.floor(endTotalMins / 60);
                                  const endHr = endHrRaw >= 24 ? 23 : endHrRaw;
                                  const endMin = endTotalMins % 60;
                                  const endHourStr = endHr.toString().padStart(2, '0');
                                  const endMinStr = (endHrRaw >= 24 ? 59 : endMin).toString().padStart(2, '0');
                                  const newEndTimeStr = `${endHourStr}:${endMinStr}`;

                                  onUpdateEventDateTime(eventId, day, newStartTimeStr, newEndTimeStr);
                                }
                              }
                              setDragOverCell(null);
                            }}
                            className={`w-full cursor-alias transition-all duration-75 relative group border-b border-slate-200/20 ${
                              isDragOver
                                ? 'bg-indigo-300/65 ring-4 ring-indigo-500 z-20 border-dashed border-indigo-600'
                                : theme === 'dark'
                                ? 'hover:bg-indigo-900/40'
                                : 'hover:bg-indigo-50/50'
                            }`}
                            style={{ height: `${hourHeight}px` }}
                            title={`Click or drop block here to schedule on ${day} at ${hr}:00`}
                          >
                            <span className={`absolute inset-x-1 inset-y-1 rounded-lg border-2 border-dashed flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] overflow-hidden ${
                              theme === 'dark'
                                ? 'bg-[#1E293B] text-[#38BDF8] border-indigo-400'
                                : 'bg-white text-indigo-700 border-indigo-400'
                            }`}>
                              + Add {hr}:00
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Real-time Current timeline locator */}
              {currentTime.visible && (mobileSingleDay === 'All' || mobileSingleDay === currentTime.day) && (
                <div
                  className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                  style={{
                    top: `${currentTime.ratio * (hoursArray.length - 1) * hourHeight}px`,
                  }}
                >
                  {/* Small red bubble at the edge of active day column */}
                  <div className={`w-3.5 h-3.5 bg-rose-500 rounded-full border-2 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] -ml-1.5 absolute ${
                    theme === 'contrast' ? 'border-black' : 'border-slate-900'
                  }`} />
                  <div className="border-t-2 border-rose-500 w-full opacity-80" />
                </div>
              )}

              {/* Render block schedule items */}
              {events.map((event) => {
                const position = getEventPosition(event);
                const hideEvent = mobileSingleDay !== 'All' && mobileSingleDay !== event.day;

                if (!position || hideEvent) return null;

                const palette = COLOR_PALETTES.find(p => p.id === event.color) || COLOR_PALETTES[0];

                // Calculate width and horizontal alignment based on selected layout (Single day vs 7 days)
                let columnStyles = {};
                if (mobileSingleDay === 'All') {
                  const dIndex = DAYS.indexOf(event.day);
                  columnStyles = {
                    left: `${(dIndex / 7) * 100}%`,
                    width: `${99 / 7}%`,
                  };
                } else {
                  columnStyles = {
                    left: '2%',
                    width: '96%',
                  };
                }

                // Check contrast / dark borders
                const cardBorder = theme === 'contrast' ? 'border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]';

                return (
                  <div
                    id={`schedule-slot-${event.id}`}
                    key={event.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, event.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEvent(event);
                    }}
                    className={`absolute z-10 p-2.5 rounded-2xl cursor-grab active:cursor-grabbing flex flex-col justify-between overflow-hidden select-none hover:-translate-x-[1px] hover:-translate-y-[1px] ${cardBorder} active:translate-x-[1px] active:translate-y-[1px] transition-transform ${palette.bg}`}
                    style={{
                      top: `${position.top}px`,
                      height: `${position.height}px`,
                      ...columnStyles,
                    }}
                    title="Drag and drop to reschedule this card!"
                  >
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-1 leading-tight">
                        <span className="font-extrabold text-xs text-slate-900 line-clamp-2 truncate font-sans uppercase tracking-tight">
                          {event.name}
                        </span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-1 text-[9px] text-slate-700 mt-1 font-bold uppercase tracking-wider truncate">
                          <MapPin className="w-2.5 h-2.5 flex-shrink-0 text-slate-900" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      {event.description && position.height >= 72 && (
                        <p className="text-[10px] text-slate-850 mt-1.5 line-clamp-2 leading-relaxed bg-white/40 p-1 rounded-md border border-slate-900/15 h-[32px] overflow-hidden">
                          {event.description}
                        </p>
                      )}
                    </div>

                    {/* Footer for timestamps in slot card */}
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold tracking-wider mt-1 pt-1.5 border-t border-slate-900/10">
                      <span className="flex items-center gap-0.5 text-slate-900 uppercase">
                        <Clock className="w-2.5 h-2.5 opacity-80" />
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
