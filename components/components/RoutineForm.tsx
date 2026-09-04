"use client";

import { useState } from "react";
import { Plus, Trash2, Clock, Repeat } from "lucide-react";
import { ExerciseMode } from "@/lib/types";

export interface DraftExercise {
  name: string;
  mode: ExerciseMode;
  work: number;
  reps: number;
  rest: number;
}

export const emptyExercise = (): DraftExercise => ({ name: "", mode: "time", work: 30, reps: 12, rest: 15 });

interface Props {
  initialName?: string;
  initialExercises?: DraftExercise[];
  submitLabel: string;
  savingLabel: string;
  onSubmit: (name: string, exercises: DraftExercise[]) => Promise<void>;
  extraAction?: React.ReactNode;
}

export default function RoutineForm({
  initialName = "",
  initialExercises,
  submitLabel,
  savingLabel,
  onSubmit,
  extraAction,
}: Props) {
  const [name, setName] = useState(initialName);
  const [exercises, setExercises] = useState<DraftExercise[]>(initialExercises?.length ? initialExercises : [emptyExercise()]);
  const [saving, setSaving] = useState(false);

  const update = (i: number, key: keyof DraftExercise, val: any) => {
    const next = [...exercises];
    next[i] = { ...next[i], [key]: val };
    setExercises(next);
  };

  const addRow = () => setExercises([...exercises, emptyExercise()]);
  const removeRow = (i: number) => setExercises(exercises.filter((_, idx) => idx !== i));

  const canSave = name.trim().length > 0 && exercises.every((e) => e.name.trim().length > 0) && !saving;

  async function handleSubmit() {
    setSaving(true);
    await onSubmit(
      name.trim(),
      exercises.map((e) => ({ ...e, name: e.name.trim() }))
    );
    setSaving(false);
  }

  return (
    <>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Routine name"
        className="mb-4 w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-[15px] text-ink"
      />

      <div className="flex flex-col gap-2.5">
        {exercises.map((ex, i) => (
          <div key={i} className="rounded-[14px] border border-border bg-surface p-3.5">
            <div className="mb-2.5 flex gap-2">
              <input
                value={ex.name}
                onChange={(e) => update(i, "name", e.target.value)}
                placeholder={`Exercise ${i + 1}`}
                className="flex-1 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-ink"
              />
              {exercises.length > 1 && (
                <button onClick={() => removeRow(i)} aria-label="Remove exercise" className="text-faint">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="mb-2.5 flex gap-1.5">
              <button
                onClick={() => update(i, "mode", "time")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-bold ${
                  ex.mode === "time"
                    ? "border-orange bg-orange/10 text-orange"
                    : "border-border bg-bg text-muted"
                }`}
              >
                <Clock size={12} /> Time
              </button>
              <button
                onClick={() => update(i, "mode", "reps")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-bold ${
                  ex.mode === "reps"
                    ? "border-purple bg-purple/10 text-purple"
                    : "border-border bg-bg text-muted"
                }`}
              >
                <Repeat size={12} /> Reps
              </button>
            </div>

            <div className="flex gap-4">
              {ex.mode === "time" ? (
                <label className="flex-1 text-xs text-muted">
                  Work (sec)
                  <input
                    type="number"
                    min={5}
                    value={ex.work}
                    onChange={(e) => update(i, "work", Number(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border border-border bg-bg px-2.5 py-2 text-sm font-bold text-orange"
                  />
                </label>
              ) : (
                <label className="flex-1 text-xs text-muted">
                  Reps
                  <input
                    type="number"
                    min={1}
                    value={ex.reps}
                    onChange={(e) => update(i, "reps", Number(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border border-border bg-bg px-2.5 py-2 text-sm font-bold text-purple"
                  />
                </label>
              )}
              <label className="flex-1 text-xs text-muted">
                Rest (sec)
                <input
                  type="number"
                  min={0}
                  value={ex.rest}
                  onChange={(e) => update(i, "rest", Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-lg border border-border bg-bg px-2.5 py-2 text-sm font-bold text-blue"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-[#3A3D44] py-3 text-[13px] font-semibold text-[#B8BCC4]"
      >
        <Plus size={14} /> Add exercise
      </button>

      <button
        disabled={!canSave}
        onClick={handleSubmit}
        className="mt-[22px] w-full rounded-2xl bg-orange py-4 font-display text-sm tracking-wide text-bg disabled:bg-border disabled:text-faint"
      >
        {saving ? savingLabel : submitLabel}
      </button>

      {extraAction}
    </>
  );
  }
