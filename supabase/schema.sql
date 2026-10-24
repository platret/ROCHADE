-- ROCHADE database schema.
-- Paste this file into the Supabase SQL editor and run it, then paste seed.sql.

-- Demo reset: removes existing ROCHADE tables and their data.
-- Delete this block if you want to keep existing data.
drop table if exists public.assignments cascade;
drop table if exists public.households cascade;
drop table if exists public.flats cascade;
drop table if exists public.phases cascade;
drop table if exists public.projects cascade;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  admin_code text unique,
  created_at timestamptz not null default now()
);

create table public.phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  building text not null,
  start_date date not null,
  end_date date not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint phases_end_after_start check (end_date >= start_date)
);

create table public.flats (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  label text not null,
  building text not null,
  floor integer not null default 0,
  rooms numeric(3, 1) not null check (rooms > 0),
  step_free boolean not null default false,
  is_temporary boolean not null default false,
  school_district text,
  created_at timestamptz not null default now()
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  members integer not null default 1 check (members > 0),
  home_flat_id uuid references public.flats (id) on delete set null,
  needs_rooms numeric(3, 1) not null default 1 check (needs_rooms > 0),
  needs_step_free boolean not null default false,
  school_district text,
  note text,
  invite_code text unique,
  created_at timestamptz not null default now()
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  household_id uuid not null unique references public.households (id) on delete cascade,
  temp_flat_id uuid references public.flats (id) on delete set null,
  move_out date,
  move_back date,
  status text not null default 'open' check (status in ('ok', 'conflict', 'open')),
  conflict_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index phases_project_idx on public.phases (project_id);
create index flats_project_idx on public.flats (project_id);
create index households_project_idx on public.households (project_id);
create index assignments_project_idx on public.assignments (project_id);

-- Realtime: publish changes with full old rows so clients can show "old date -> new date".
alter table public.phases replica identity full;
alter table public.households replica identity full;
alter table public.assignments replica identity full;
alter publication supabase_realtime add table public.phases, public.households, public.assignments;

-- Row Level Security.
-- DEMO ONLY: ROCHADE has no sign-in yet, so the anon key may read and write every row.
-- Replace these policies with real ones before any production use.
alter table public.projects enable row level security;
alter table public.phases enable row level security;
alter table public.flats enable row level security;
alter table public.households enable row level security;
alter table public.assignments enable row level security;

create policy "demo anon select projects" on public.projects for select to anon using (true);
create policy "demo anon insert projects" on public.projects for insert to anon with check (true);
create policy "demo anon update projects" on public.projects for update to anon using (true) with check (true);

create policy "demo anon select phases" on public.phases for select to anon using (true);
create policy "demo anon insert phases" on public.phases for insert to anon with check (true);
create policy "demo anon update phases" on public.phases for update to anon using (true) with check (true);

create policy "demo anon select flats" on public.flats for select to anon using (true);
create policy "demo anon insert flats" on public.flats for insert to anon with check (true);
create policy "demo anon update flats" on public.flats for update to anon using (true) with check (true);

create policy "demo anon select households" on public.households for select to anon using (true);
create policy "demo anon insert households" on public.households for insert to anon with check (true);
create policy "demo anon update households" on public.households for update to anon using (true) with check (true);

create policy "demo anon select assignments" on public.assignments for select to anon using (true);
create policy "demo anon insert assignments" on public.assignments for insert to anon with check (true);
create policy "demo anon update assignments" on public.assignments for update to anon using (true) with check (true);

-- Skip updates that change nothing, so Realtime only emits real changes.
create trigger phases_skip_noop_updates before update on public.phases
  for each row execute function suppress_redundant_updates_trigger();
create trigger households_skip_noop_updates before update on public.households
  for each row execute function suppress_redundant_updates_trigger();
create trigger assignments_skip_noop_updates before update on public.assignments
  for each row execute function suppress_redundant_updates_trigger();
