"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Play, Pause, SkipForward, RotateCcw, ChevronLeft, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PRESETS } from "@/lib/presets";
import { Exercise, ExerciseMode } from "@/lib/types";
import { formatTime } from "@/lib/format";

interface NormalizedExercise {
  name: string;
  mode: ExerciseMode;
  work: number;
  reps: number;
  rest: number;
}

interface NormalizedRoutine {
  id: string;
  name: string;
  color: string;
  exercises: NormalizedExercise[];
}

// Simple beep using Web Audio API — no external assets
function useBeeper() {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback((freq = 880, dur = 0.12) => {
    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        ctxRef.current = new AC();
      }
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {
      // audio not available, fail silently
    }
  }, []);
}

export default function SessionPage() {
  const params = useParams<{ routineId: string }>();
  const router = useRouter();
  const supabase = createClient();
  const beep = useBeeper();

  const [routine, setRoutine] = useState<NormalizedRoutine | null>(null);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"work" | "rest" | "done">("work");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const lastBeepSecond = useRef<number | null>(null);
  const startRef = useRef<number>(Date.now());

  // ---- Load routine (preset or from Supabase) ----
  useEffect(() => {
    (async () => {
      const id = params.routineId;
      if (id.startsWith("preset-")) {
        const presetId = id.replace("preset-", "");
        const preset = PRESETS.find((p) => p.id === presetId);
        if (preset) {
          const normalized: NormalizedRoutine = {
            id,
            name: preset.name,
            color: preset.color,
            exercises: preset.exercises.map((e) => ({
              name: e.name,
              mode: e.mode,
              work: e.work ?? 0,
              reps: e.reps ?? 0,
              rest: e.rest,
            })),
          };
          setRoutine(normalized);
          setSecondsLeft(normalized.exercises[0].mode === "time" ? normalized.exercises[0].work : 0);
          setRunning(normalized.exercises[0].mode === "time");
        }
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("routines")
        .select("id, name, color, exercises(*)")
        .eq("id", id)
        .single();

      if (data) {
        const sortedExercises = [...(data.exercises as Exercise[])].sort((a, b) => a.position - b.position);
        const normalized: NormalizedRoutine = {
          id: data.id,
          name: data.name,
          color: data.color,
          exercises: sortedExercises.map((e) => ({
            name: e.name,
            mode: e.mode,
            work: e.work_seconds ?? 0,
            reps: e.reps ?? 0,
            rest: e.rest_seconds,
          })),
        };
        setRoutine(normalized);
        setSecondsLeft(normalized.exercises[0].mode === "time" ? normalized.exercises[0].work : 0);
        setRunning(normalized.exercises[0].mode === "time");
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.routineId]);

  const current = routine?.exercises[index];
  const isLast = routine ? index === routine.exercises.length - 1 : false;
  const isRepsWork = phase === "work" && current?.mode === "reps";

  // ---- Countdown ----
  useEffect(() => {
    if (!running || phase === "done" || isRepsWork || !routine) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          handlePhaseEnd();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase, index, isRepsWork, routine]);

  useEffect(() => {
    if (!isRepsWork && secondsLeft > 0 && secondsLeft <= 3 && lastBeepSecond.current !== secondsLeft) {
      beep(660, 0.08);
      lastBeepSecond.current = secondsLeft;
    }
  }, [secondsLeft, beep, isRepsWork]);

  async function saveSession() {
    if (!routine) return;
    const durationSec = Math.round((Date.now() - startRef.current) / 1000);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("sessions").insert({
      user_id: user.id,
      routine_id: routine.id.startsWith("preset-") ? null : routine.id,
      routine_name: routine.name,
      color: routine.color,
      duration_seconds: durationSec,
      exercise_count: routine.exercises.length,
    });
  }

  function handlePhaseEnd() {
    if (!routine || !current) return;
    if (phase === "work") {
      if (current.rest > 0) {
        beep(440, 0.2);
        setPhase("rest");
        setSecondsLeft(current.rest);
        setRunning(true);
      } else {
        advanceToNext();
      }
    } else if (phase === "rest") {
      advanceToNext();
    }
  }

  function markRepsDone() {
    if (!current) return;
    if (current.rest > 0) {
      beep(440, 0.2);
      setPhase("rest");
      setSecondsLeft(current.rest);
      setRunning(true);
    } else {
      advanceToNext();
    }
  }

  function advanceToNext() {
    if (!routine) return;
    if (isLast) {
      beep(988, 0.3);
      setPhase("done");
      setRunning(false);
      saveSession();
    } else {
      beep(880, 0.15);
      const nextIndex = index + 1;
      const nextEx = routine.exercises[nextIndex];
      setIndex(nextIndex);
      setPhase("work");
      if (nextEx.mode === "time") {
        setSecondsLeft(nextEx.work);
        setRunning(true);
      } else {
        setSecondsLeft(0);
        setRunning(false);
      }
    }
  }

  function skip() {
    if (!current) return;
    if (phase === "work") {
      if (current.mode === "reps") {
        markRepsDone();
      } else if (current.rest > 0) {
        setPhase("rest");
        setSecondsLeft(current.rest);
        setRunning(true);
      } else {
        advanceToNext();
      }
    } else {
      advanceToNext();
    }
  }

  function restart() {
    if (!routine) return;
    setIndex(0);
    setPhase("work");
    const ex0 = routine.exercises[0];
    if (ex0.mode === "time") {
      setSecondsLeft(ex0.work);
      setRunning(true);
    } else {
      setSecondsLeft(0);
      setRunning(false);
    }
    startRef.current = Date.now();
  }

  if (loading) {
    return <div className="p-6 text-sm text-faint">Loading…</div>;
  }

  if (!routine || !current) {
    return (
      <div className="p-6 text-sm text-muted">
        Routine not found.{" "}
        <button className="text-orange underline" onClick={() => router.push("/")}>
          Go back
        </button>
      </div>
    );
  }

  const bgColor =
    phase === "work" ? (current.mode === "reps" ? "#C77DFF" : "#FF4D2E") : phase === "rest" ? "#2E6BFF" : "#0E0F12";
  const nextEx = !isLast ? routine.exercises[index + 1] : null;

  if (phase === "done") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="font-display text-[42px] text-ink mb-2">Done.</div>
        <div className="mb-8 text-[15px] text-muted">
          {routine.name} · {routine.exercises.length} moves complete
        </div>
        <div className="flex w-full gap-3">
          <button
            onClick={restart}
            className="flex-1 rounded-2xl border border-border bg-surface py-4 text-sm font-bold text-ink"
          >
            Do it again
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 rounded-2xl bg-orange py-4 font-display text-sm text-bg"
          >
            EXIT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-5 pt-5">
        <button onClick={() => router.push("/")} aria-label="Exit session" className="p-1 text-bg opacity-70">
          <ChevronLeft size={22} />
        </button>
        <div className="text-xs font-bold tracking-wide text-bg opacity-75">
          {index + 1} / {routine.exercises.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-5 pt-3.5">
        {routine.exercises.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{
              background: i < index ? "#0E0F12" : i === index ? "rgba(14,15,18,0.5)" : "rgba(14,15,18,0.15)",
            }}
          />
        ))}
      </div>

      <div
        className="flex flex-1 flex-col items-center justify-center px-6 py-5 transition-colors duration-400"
        style={{ background: bgColor }}
      >
        <div className="mb-2.5 text-[13px] font-bold uppercase tracking-[2px] text-bg opacity-70">
          {phase === "rest" ? "Rest" : isRepsWork ? "Reps" : "Go"}
        </div>

        {isRepsWork ? (
          <div className="font-display text-[96px] leading-none text-bg">{current.reps}</div>
        ) : (
          <div className="font-display text-[96px] leading-none tabular-nums text-bg">
            {formatTime(secondsLeft)}
          </div>
        )}

        <div className="mt-[18px] text-center font-display text-[26px] text-bg">{current.name}</div>

        {isRepsWork && (
          <button
            onClick={markRepsDone}
            className="mt-[26px] flex items-center gap-2 rounded-full bg-bg px-8 py-3.5 font-display text-sm tracking-wide text-ink"
          >
            <Check size={16} /> MARK COMPLETE
          </button>
        )}

        {nextEx && (
          <div className="mt-[22px] rounded-full bg-bg/10 px-[18px] py-2.5 text-[13px] text-bg opacity-85">
            Next: {phase === "rest" ? current.name : nextEx.name}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-5 bg-bg px-5 pb-9 pt-6">
        <button
          onClick={restart}
          aria-label="Restart"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-[#B8BCC4]"
        >
          <RotateCcw size={18} />
        </button>

        {!isRepsWork ? (
          <button
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? "Pause" : "Play"}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-ink text-bg"
          >
            {running ? <Pause size={28} fill="#0E0F12" /> : <Play size={28} fill="#0E0F12" className="ml-0.5" />}
          </button>
        ) : (
          <button
            onClick={markRepsDone}
            aria-label="Mark reps complete"
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-ink text-bg"
          >
            <Check size={28} />
          </button>
        )}

        <button
          onClick={skip}
          aria-label="Skip"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-[#B8BCC4]"
        >
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
    }
