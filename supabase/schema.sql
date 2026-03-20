-- supabase/schema.sql
-- Run this in your Supabase SQL Editor to create the analyses table

create table if not exists analyses (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  raw_input         text not null,
  clarity_score     integer not null check (clarity_score between 0 and 100),
  score_verdict     text,
  score_breakdown   jsonb,
  simplified_version text,
  structured_plan   jsonb,
  missing_elements  jsonb,
  actionable_steps  jsonb
);

-- Index for quick lookups by score (useful for analytics)
create index if not exists idx_analyses_clarity_score on analyses(clarity_score);
create index if not exists idx_analyses_created_at   on analyses(created_at desc);

-- Enable Row Level Security (recommended for Supabase)
alter table analyses enable row level security;

-- Allow anonymous inserts (the app doesn't require auth)
create policy "Allow anonymous inserts"
  on analyses for insert
  to anon
  with check (true);

-- Allow reading all records (for a history feature or admin view)
create policy "Allow anonymous reads"
  on analyses for select
  to anon
  using (true);
