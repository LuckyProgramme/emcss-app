# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# EMCSS Web App

Membership portal for the **Entertainment Multimedia Computing Students Society (EMCSS)** — built on Next.js App Router + Supabase.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm run lint       # ESLint
```

Required env vars (create `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture

### Route Groups

- `(auth)/` — Public pages (`/login`, `/signup`). No layout wrapping.
- `(member)/` — Protected pages with shared sidebar layout. The layout (`app/(member)/layout.tsx`) is the **auth gate**: it calls Supabase server-side, redirects to `/login` if unauthenticated, fetches `profiles`, and conditionally shows admin nav when `profile.role === 'admin'`.
- `auth/callback/route.ts` — OAuth exchange handler. After Supabase redirects back, this route exchanges the code for a session, upserts a `profiles` row (fallback if the DB trigger didn't fire), and redirects to `/profile`.
- Root `/` redirects straight to `/profile`.

### Supabase Client Split

Two clients — use the right one based on context:

| File | When to use |
|---|---|
| `lib/supabase.ts` | `'use client'` components (browser) |
| `lib/supabase-server.ts` | Server Components, Route Handlers (uses `next/headers` cookies) |

### Data Model (`profiles` table)

Columns: `id` (matches Supabase auth UID), `full_name`, `email`, `student_id`, `course`, `phone`, `gender`, `role` (`member` \| `admin`), `status` (`pending` \| `active` \| `inactive`), `year_joined`, `avatar_url`, `created_at`.

New members start with `status: 'pending'` — an admin approves them on `/admin/dashboard`.

### Component Pattern

Pages are Server Components that fetch from Supabase and pass data down to `*Client` components (`'use client'`) for interactive parts. Example: `AdminDashboardPage` → `AdminDashboardClient`.

For pages with complex client-side state, a `useXxxViewModel()` hook separates state/logic from JSX (see `login/page.tsx`).

Shared UI primitives live in `components/ui/` (shadcn/ui generated — don't hand-edit).

### Font System

Three CSS variables set in `app/layout.tsx` and consumed everywhere:

| Variable | Font | Use |
|---|---|---|
| `--font-display` | Space Grotesk | Headings, logo, bold labels |
| `--font-body` | Inter | Body text, inputs |
| `--font-label` | Work Sans | Small caps, tracking-widest labels |

Apply via `style={{ fontFamily: 'var(--font-display)' }}` or `font-sans`/`font-display` Tailwind classes.

### Design Tokens

Defined as CSS custom properties in `app/globals.css` and surfaced through Tailwind's `@theme inline`. Prefer tokens over raw hex values in new code.

| Token | Value | Role |
|---|---|---|
| `--background` | `#131408` | Page background |
| `--card` | `#1b1c1c` | Card/sidebar surface |
| `--primary` | `#e7ff04` | Neon accent (CTA buttons, rings) |
| `--primary-foreground` | `#001c95` | Text on primary |
| `--secondary` | `#55a183` | Teal accent |
| `--muted-foreground` | `#c7c9ab` | Subdued text |
| `--tertiary-text` | `#adadad` | Timestamps, labels |
| `--destructive` | `#ffb4ab` | Error states |
| `--border` | `rgba(70,72,50,0.15)` | Subtle borders |

Brand social links: Facebook `facebook.com/EMCStudentsSociety` · Twitter `twitter.com/ue_emcss` · Instagram `instagram.com/ue.emcss` · Email `emcss.official@gmail.com`

## Planned (not yet built)

- `/card` — Member digital ID card with real QR code (packages `html5-qrcode`, `qrcode.react` already installed; nav link already present in sidebar)
- Magazine showcase, Creator Registry, Blog, Announcements carousel

## Reference

- `../EMCSS Archiving institute/` — Static HTML prototype; check here for existing UI patterns before building new sections.
