import { Routine, SessionRecord } from "./types";

const ROUTINES_KEY = "setlist:routines";
const SESSIONS_KEY = "setlist:sessions";

export function getRoutines(): Routine[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ROUTINES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveRoutine(routine: Routine): void {
  const routines = getRoutines();
  const idx = routines.findIndex((r) => r.id === routine.id);
  if (idx >= 0) routines[idx] = routine;
  else routines.push(routine);
  localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
}

export function deleteRoutine(id: string): void {
  const routines = getRoutines().filter((r) => r.id !== id);
  localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
}

export function getSessions(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SESSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function logSession(session: SessionRecord): void {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }
