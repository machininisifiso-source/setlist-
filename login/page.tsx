export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange">
        <span className="text-2xl">🏋️</span>
      </div>
      <h1 className="font-display text-3xl text-ink mb-2 text-center">Setlist</h1>
      <p className="text-muted text-sm mb-8 text-center">
        Sign in to track your routines and streaks.
      </p>
      <form className="w-full max-w-xs flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink text-sm"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-orange py-3 font-display text-sm text-bg tracking-wide"
        >
          SEND LOGIN LINK
        </button>
      </form>
    </div>
  );
          }
