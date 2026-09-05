export type ExerciseMode = "time" | "reps";

export interface Exercise {
  id: string;
  name: string;
  mode: ExerciseMode;
  work_seconds: number | null;
  reps: number | null;
  rest_seconds: number;
  position: number;
}

export interface Routine {
  id: string;
  name: string;
  tagline: string | null;
  color: string;
  is_preset: boolean;
  exercises: Exercise[];
}

export interface SessionRecord {
  id: string;
  routine_id: string | null;
  routine_name: string;
  color: string;
  duration_seconds: number;
  exercise_count: number;
  completed_at: string;
}

// Presets ship with the app rather than living in the DB (see schema notes).
// Shape matches Routine but with client-generated ids so the timer/session
// logic can treat presets and saved routines identically.
export interface PresetExercise {
  name: string;
  mode: ExerciseMode;
  work?: number;
  reps?: number;
  rest: number;
}

export interface Preset {
  id: string;
  name: string;
  tagline: string;
  color: string;
  exercises: PresetExercise[];
  }
