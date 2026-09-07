# Setlist

Guided interval workouts — timed rounds or rep-based sets, with streaks and history.

## Stack
Next.js 14 (App Router) · Supabase (auth + Postgres) · Tailwind · Vercel

## Setup

1. **Create a Supabase project** at supabase.com.
2. **Run the schema** — open the SQL editor in your Supabase dashboard and run `setlist_schema.sql` (the file shared alongside this project). This creates the `routines`, `exercises`, and `sessions` tables plus row-level security policies.
3. **Enable email auth** — in Supabase, go to Authentication > Providers and make sure Email is on. Magic link (OTP) is used here, so no password flow is needed.
4. **Copy environment variables**:
   ```
   cp .env.local.example .env.local
   ```
   Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase → Project Settings → API.
5. **Install and run**:
   ```
   npm install
   npm run dev
   ```
   Visit `http://localhost:3000` — you'll be redirected to `/login` to sign in with a magic link.

## Deploying
Push to a GitHub repo, import it into Vercel, and add the same two environment variables in the Vercel project settings. Also add your production URL to Supabase → Authentication → URL Configuration (Site URL + Redirect URLs) so magic links work in production.

## Structure
- `app/page.tsx` — routine picker (presets + your saved routines)
- `app/builder/page.tsx` — create a custom routine (time or reps mode per exercise)
- `app/session/[routineId]/page.tsx` — the guided timer
- `app/history/page.tsx` — session history, streak, and weekly stats
- `lib/presets.ts` — the built-in routines (not stored in the DB — see schema notes if you want them DB-managed instead)
- `middleware.ts` — keeps you signed in and redirects unauthenticated visitors to `/login`

## What's next
- Editing existing routines (currently create + delete only)
- Rest-day / weekly goal settings
- Push notifications or reminders
