"use client";

import { Clock, Repeat, Trash2, Pencil } from "lucide-react";
import { Preset, Routine } from "@/lib/types";

type CardData =
  | { kind: "preset"; data: Preset }
  | { kind: "routine"; data: Routine };

interface Props {
  card: CardData;
  onClick: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function RoutineCard({ card, onClick, onDelete, onEdit }: Props) {
  const isPreset = card.kind === "preset";
  const name = card.data.name;
  const color = card.data.color;
  const exercises = isPreset ? card.data.exercises : card.data.exercises;

  const timeSec = exercises.reduce((a: number, e: any) => {
    const work = e.mode === "reps" ? 0 : e.work ?? e.work_seconds ?? 0;
    return a + work + (e.rest ?? e.rest_seconds ?? 0);
  }, 0);
  const repsCount = exercises.filter((e: any) => e.mode === "reps").length;

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface p-[18px]"
    >
      <div className="absolute left-0 top-0 h-full w-[5px]" style={{ background: color }} />
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-lg text-ink mb-1">{name}</div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span>{exercises.length} moves</span>
            {timeSec > 0 && (
              <span className="flex items-center gap-1">
                · <Clock size={11} /> ~{Math.max(1, Math.round(timeSec / 60))} min
              </span>
            )}
            {repsCount > 0 && (
              <span className="flex items-center gap-1">
                · <Repeat size={11} /> {repsCount} rep sets
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              aria-label={`Edit ${name}`}
              className="p-1 text-faint"
            >
              <Pencil size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label={`Delete ${name}`}
              className="p-1 text-faint"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
