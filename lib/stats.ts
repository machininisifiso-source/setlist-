import { SessionRecord } from "./types";

export function computeStreak(history: SessionRecord[]): number {
  if (!history.length) return 0;
  const days = new Set(history.map((h) => new Date(h.completed_at).toDateString()));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeWeekStats(history: SessionRecord[]) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);
  const sessions = history.filter((h) => new Date(h.completed_at) >= weekAgo);
  const totalSec = sessions.reduce((a, h) => a + h.duration_seconds, 0);
  return { count: sessions.length, totalSec };
}

export function last7DaysActivity(history: SessionRecord[]) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dayStr = d.toDateString();
    const count = history.filter((h) => new Date(h.completed_at).toDateString() === dayStr).length;
    days.push({ label: d.toLocaleDateString([], { weekday: "narrow" }), count, isToday: i === 0 });
  }
  return days;
                       }
