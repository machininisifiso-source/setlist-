"use client";

import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange">
        <Dumbbell size={28} color="#0E0F12" strokeWidth={2.5} />
      </div>
      <h1 className="font-display text-3xl text-ink mb-2 text-center">Setlist</h1>
      <p className="text-muted text-sm mb-8 text-center">Sign in to track your routines and streaks.</p>

      {status === "sent" ? (
        <p className="text-ink text-sm text-center">
          Check <span className="text-orange">{email}</span> for a sign-in link.
        </p>
      ) : (
        <form onSubmit={sendLink} className="w-full max-w-xs flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink text-sm"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-xl bg-orange py-3 font-display text-sm text-bg tracking-wide"
          >
            {status === "sending" ? "SENDING…" : "SEND LOGIN LINK"}
          </button>
          {status === "error" && (
            <p className="text-sm text-orange">Something went wrong. Try again.</p>
          )}
        </form>
      )}
    </div>
  );
              }
