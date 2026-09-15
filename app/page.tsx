import Link from "next/link";
import { PRESETS } from "@/lib/presets";
import { Plus, History } from "lucide-react";

export default function HomePage() {
  return (
    <div className="px-5 pb-10 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Setlist</h1>
        <Link href="/history" className="text-muted">
          <History size={22} />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {PRESETS.map((routine) => (
          <Link
            key={routine.id}
            href={`/session/${routine.id}`}
            className="rounded-2xl border border-border bg-surface p-4"
            style={{ borderLeft: `4px solid ${routine.color}` }}
          >
            <h2 className="font-display text-lg text-ink">{routine.name}</h2>
            <p className="text-sm text-muted mt-1">{routine.tagline}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/builder"
        className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-[#3A3D44] py-3 text-[13px] font-semibold text-[#B8BCC4]"
      >
        <Plus size={14} /> New routine
      </Link>
    </div>
  );
              }
