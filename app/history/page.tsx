"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SessionRecord } from "@/lib/types";
import { formatDuration, formatDate } from "@/lib/format";
import StatsCard from "@/components/StatsCard";

export default function HistoryPage() {
  const router = useRouter();
  const supabase = createClient();
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("sessions")
        .select("id, routine_id, routine_name, color, duration_seconds, exercise_count, completed_at")
        .order("completed_at", { ascending: false })
        .limit(100);
      if (data) setHistory(data as SessionRecord[]);
      setLoading(false);
    })();
  }, []);

  async function clearAll() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("sessions").delete().eq("user_id", user.id);
    setHistory([]);
  }

  return (
    <div className="px-5 pb-10 pt-6">
      <div className="mb-[18px] flex items-center justify-between">
        <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-muted">
          <ChevronLeft size={18} /> Back
        </button>
        {history.length > 0 && (
          <button onClick={clearAll} className="text-xs font-semibold text-faint">
            Clear all
          </button>
        )}
      </div>

      <h1 className="font-display text-[28px] text-ink mb-[18px]">History</h1>

      {!loading && <StatsCard history={history} />}

      {loading && <div className="text-sm text-faint">Loading…</div>}

      {!loading && history.length === 0 && (
        <div className="rounded-2xl border border-border px-5 py-8 text-center text-sm text-faint">
          No sessions yet. Finish a routine and it&apos;ll show up here.
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {history.map((h) => (
          <div key={h.id} className="relative overflow-hidden rounded-[14px] border border-border bg-surface px-4 py-3.5">
            <div className="absolute left-0 top-0 h-full w-1" style={{ background: h.color || "#FF4D2E" }} />
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-[15px] text-ink mb-0.5">{h.routine_name}</div>
                <div className="text-xs text-muted">{formatDate(h.completed_at)}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-sm text-ink">{formatDuration(h.duration_seconds)}</div>
                <div className="text-[11px] text-muted">{h.exercise_count} moves</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
                }
