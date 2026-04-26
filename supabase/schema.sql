create extension if not exists pgcrypto;

create table if not exists public.learner_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  degree text,
  institution text,
  institutional_email text,
  fellowship_year text,
  flexible_bronchoscopy_count integer,
  ebus_count integer,
  ebus_confidence text,
  invite_sent_at timestamptz,
  last_sign_in_at timestamptz,
  must_set_password boolean not null default true,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.learner_profiles
  add column if not exists full_name text,
  add column if not exists degree text,
  add column if not exists institution text,
  add column if not exists institutional_email text,
  add column if not exists fellowship_year text,
  add column if not exists flexible_bronchoscopy_count integer,
  add column if not exists ebus_count integer,
  add column if not exists ebus_confidence text;

alter table public.learner_profiles
  drop constraint if exists learner_profiles_degree_check,
  add constraint learner_profiles_degree_check check (degree is null or degree in ('MD', 'DO'));

alter table public.learner_profiles
  drop constraint if exists learner_profiles_fellowship_year_check,
  add constraint learner_profiles_fellowship_year_check check (fellowship_year is null or fellowship_year in ('first', 'second', 'third'));

alter table public.learner_profiles
  drop constraint if exists learner_profiles_counts_check,
  add constraint learner_profiles_counts_check check (
    (flexible_bronchoscopy_count is null or flexible_bronchoscopy_count >= 0)
    and (ebus_count is null or ebus_count >= 0)
  );

alter table public.learner_profiles
  drop constraint if exists learner_profiles_ebus_confidence_check,
  add constraint learner_profiles_ebus_confidence_check check (ebus_confidence is null or ebus_confidence in ('high', 'moderate', 'low'));

create table if not exists public.learner_progress_snapshots (
  learner_id uuid primary key references public.learner_profiles (id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.learner_module_progress (
  learner_id uuid not null references public.learner_profiles (id) on delete cascade,
  module_id text not null,
  percent_complete integer not null default 0,
  visited_at timestamptz,
  completed_at timestamptz,
  time_spent_seconds integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (learner_id, module_id)
);

create table if not exists public.learner_module_sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learner_profiles (id) on delete cascade,
  module_id text not null,
  route_path text not null,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  duration_seconds integer not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.learner_lecture_progress (
  learner_id uuid not null references public.learner_profiles (id) on delete cascade,
  lecture_id text not null,
  watched_seconds integer not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  last_opened_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (learner_id, lecture_id)
);

create table if not exists public.learner_pretest_attempts (
  learner_id uuid not null references public.learner_profiles (id) on delete cascade,
  attempt_number integer not null,
  score integer not null,
  answered_count integer not null,
  total_questions integer not null,
  percent integer not null,
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (learner_id, attempt_number)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_learner_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  flexible_count integer;
  ebus_case_count integer;
begin
  if new.raw_user_meta_data->>'flexible_bronchoscopy_count' ~ '^[0-9]+$' then
    flexible_count = (new.raw_user_meta_data->>'flexible_bronchoscopy_count')::integer;
  end if;

  if new.raw_user_meta_data->>'ebus_count' ~ '^[0-9]+$' then
    ebus_case_count = (new.raw_user_meta_data->>'ebus_count')::integer;
  end if;

  insert into public.learner_profiles (
    id,
    email,
    full_name,
    degree,
    institution,
    institutional_email,
    fellowship_year,
    flexible_bronchoscopy_count,
    ebus_count,
    ebus_confidence,
    must_set_password,
    onboarding_completed_at
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'degree',
    new.raw_user_meta_data->>'institution',
    coalesce(new.raw_user_meta_data->>'institutional_email', new.email),
    new.raw_user_meta_data->>'fellowship_year',
    flexible_count,
    ebus_case_count,
    new.raw_user_meta_data->>'ebus_confidence',
    coalesce((new.raw_user_meta_data->>'must_set_password')::boolean, true),
    case
      when new.raw_user_meta_data ? 'must_set_password'
        and (new.raw_user_meta_data->>'must_set_password')::boolean = false
      then timezone('utc', now())
      else null
    end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists set_learner_profiles_updated_at on public.learner_profiles;
create trigger set_learner_profiles_updated_at
before update on public.learner_profiles
for each row
execute procedure public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_learner_profile();

alter table public.learner_profiles enable row level security;
alter table public.learner_progress_snapshots enable row level security;
alter table public.learner_module_progress enable row level security;
alter table public.learner_module_sessions enable row level security;
alter table public.learner_lecture_progress enable row level security;
alter table public.learner_pretest_attempts enable row level security;

drop policy if exists "Learners can view their own profile" on public.learner_profiles;
create policy "Learners can view their own profile"
on public.learner_profiles
for select
using (auth.uid() = id);

drop policy if exists "Learners can upsert their own profile" on public.learner_profiles;
create policy "Learners can upsert their own profile"
on public.learner_profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Learners can update their own profile" on public.learner_profiles;
create policy "Learners can update their own profile"
on public.learner_profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Learners can read their own snapshots" on public.learner_progress_snapshots;
create policy "Learners can read their own snapshots"
on public.learner_progress_snapshots
for select
using (auth.uid() = learner_id);

drop policy if exists "Learners can write their own snapshots" on public.learner_progress_snapshots;
create policy "Learners can write their own snapshots"
on public.learner_progress_snapshots
for insert
with check (auth.uid() = learner_id);

drop policy if exists "Learners can update their own snapshots" on public.learner_progress_snapshots;
create policy "Learners can update their own snapshots"
on public.learner_progress_snapshots
for update
using (auth.uid() = learner_id)
with check (auth.uid() = learner_id);

drop policy if exists "Learners can read their own module progress" on public.learner_module_progress;
create policy "Learners can read their own module progress"
on public.learner_module_progress
for select
using (auth.uid() = learner_id);

drop policy if exists "Learners can write their own module progress" on public.learner_module_progress;
create policy "Learners can write their own module progress"
on public.learner_module_progress
for insert
with check (auth.uid() = learner_id);

drop policy if exists "Learners can update their own module progress" on public.learner_module_progress;
create policy "Learners can update their own module progress"
on public.learner_module_progress
for update
using (auth.uid() = learner_id)
with check (auth.uid() = learner_id);

drop policy if exists "Learners can read their own module sessions" on public.learner_module_sessions;
create policy "Learners can read their own module sessions"
on public.learner_module_sessions
for select
using (auth.uid() = learner_id);

drop policy if exists "Learners can insert their own module sessions" on public.learner_module_sessions;
create policy "Learners can insert their own module sessions"
on public.learner_module_sessions
for insert
with check (auth.uid() = learner_id);

drop policy if exists "Learners can read their own lecture progress" on public.learner_lecture_progress;
create policy "Learners can read their own lecture progress"
on public.learner_lecture_progress
for select
using (auth.uid() = learner_id);

drop policy if exists "Learners can write their own lecture progress" on public.learner_lecture_progress;
create policy "Learners can write their own lecture progress"
on public.learner_lecture_progress
for insert
with check (auth.uid() = learner_id);

drop policy if exists "Learners can update their own lecture progress" on public.learner_lecture_progress;
create policy "Learners can update their own lecture progress"
on public.learner_lecture_progress
for update
using (auth.uid() = learner_id)
with check (auth.uid() = learner_id);

drop policy if exists "Learners can read their own pretest attempts" on public.learner_pretest_attempts;
create policy "Learners can read their own pretest attempts"
on public.learner_pretest_attempts
for select
using (auth.uid() = learner_id);

drop policy if exists "Learners can write their own pretest attempts" on public.learner_pretest_attempts;
create policy "Learners can write their own pretest attempts"
on public.learner_pretest_attempts
for insert
with check (auth.uid() = learner_id);

drop policy if exists "Learners can update their own pretest attempts" on public.learner_pretest_attempts;
create policy "Learners can update their own pretest attempts"
on public.learner_pretest_attempts
for update
using (auth.uid() = learner_id)
with check (auth.uid() = learner_id);
