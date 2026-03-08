# Link Vault

Professional link research dashboard built with Next.js, Supabase SSR Auth, Shadcn/UI, Framer Motion, and Lucide icons.

## Features

- Dark, Linear-inspired UI with responsive dashboard shell
- Supabase auth (email/password + Google/GitHub OAuth)
- Dynamic categories with searchable category picker
- Link CRUD (add, edit, delete) with source tracking
- Auto-enrichment API (`/api/enrich`) for metadata extraction
- Rich URL embed previews inside link details modal
- Keyboard search focus (`Cmd/Ctrl + K`)
- PWA-ready setup (manifest + service worker registration)
- Loading skeletons for dashboard cards and details modal

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + Shadcn/UI
- Framer Motion
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)

## Project Structure

```txt
src/
  app/
    (auth)/login
    (auth)/signup
    api/enrich
    auth/callback
    page.tsx
  components/
    auth/
    dashboard/
    ui/
  lib/supabase/
```

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Create env file

```bash
cp .env.local.example .env.local
```

3. Fill required env vars in `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_xxx
```

4. Run dev server

```bash
npm run dev
```

5. Open `http://localhost:3000`

## Supabase Table Requirements

App queries/inserts these columns in `public.vault_links`:

- `id` (uuid)
- `title` (text)
- `url` (text)
- `source_url` (text)
- `category` (text)
- `status` (text)
- `summary` (text, nullable)
- `created_at` (timestamptz)

Recommended baseline SQL:

```sql
create extension if not exists pgcrypto;

create table if not exists public.vault_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  source_url text not null,
  category text not null,
  status text not null default 'Backlog'
    check (status in ('Backlog','Researching','Completed','Important')),
  summary text,
  created_at timestamptz not null default now()
);

create index if not exists vault_links_user_created_idx
  on public.vault_links (user_id, created_at desc);

alter table public.vault_links enable row level security;

create policy "Users can read own links"
  on public.vault_links
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own links"
  on public.vault_links
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own links"
  on public.vault_links
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own links"
  on public.vault_links
  for delete
  using (auth.uid() = user_id);
```

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint project

## Deploy (Netlify)

This repo includes `netlify.toml` configured for Next.js runtime.

Required Netlify environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
