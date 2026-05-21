export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimetableEvent {
  id: string;
  name: string;
  day: DayOfWeek;
  startTime: string; // "HH:MM" e.g. "09:00"
  endTime: string;   // "HH:MM" e.g. "10:30"
  color: string;     // color key (e.g., 'primary', 'success', etc.)
  description?: string;
  location?: string;
}

export interface IdeaCard {
  id: string;
  title: string;
  content: string;
  category: string;  // e.g. "To Do", "Brainstorm", "Resources"
  color: string;     // color key (amber, emerald, sky, rose, violet)
  createdAt: number;
}

export interface BoardColumn {
  id: string;
  title: string;
  color: string;
}
