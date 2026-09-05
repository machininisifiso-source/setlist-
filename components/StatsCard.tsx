"use client";

import { Flame } from "lucide-react";
import { SessionRecord } from "@/lib/types";
import { computeStreak, computeWeekStats, last7DaysActivity } from "@/lib/stats";
import { formatDuration } from "@/lib/format";

export default function StatsCard({ history }: { history: SessionRecord[] }) {
  const streak = computeStreak(history);
  const week = computeWeekStats(history);
  const days = last7DaysActivity(history);
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="mb-5 rounded-2xl border border-border bg-surface p-[18px]">
      <div className="mb-[18px] flex gap-3">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-1.5">
            <Flame size={16} color="#FF9F1C" fill={streak > 0 ? "#FF9F1C" : "none"} />
            <span className="font-display text-2xl text-ink">{streak}</span>
          </div>
          <div className="text-[11px] font-bold text-muted">DAY STREAK</div>
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1">
          <div className="font-display text-2xl text-ink mb-1">{week.count}</div>
          <div className="text-[11px] font-bold text-muted">SESSIONS · 7D</div>
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1">
          <div className="font-display text-2xl text-ink mb-1">{formatDuration(week.totalSec)}</div>
          <div className="text-[11px] font-bold text-muted">TIME · 7D</div>
        </div>
      </div>

      <div className="flex h-14 items-end gap-2">
        {days.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-9 w-full items-end">
              <div
                className="w-full rounded transition-[height] duration-300"
                style={{
                  height: d.count > 0 ? `${Math.max(18, (d.count / maxCount) * 36)}px` : "3px",
                  background: d.count > 0 ? (d.isToday ? "#FF4D2E" : "#3A3D44") : "#1E2025",
                }}
              />
            </div>
            <span className={`text-[10px] font-bold ${d.isToday ? "text-orange" : "text-faint"}`}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
      }
