-- Lumina: таблицы, правила доступа и хранилище фото.
-- Как применить: Supabase → SQL Editor → New query → вставить весь файл → Run.
-- Скрипт можно запускать повторно: он ничего не сломает.

-- ---------- Профиль пользователя ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- Профиль создаётся автоматически при регистрации.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Исходные фото ----------
create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  storage_path text not null,
  mime_type text,
  size_bytes integer,
  created_at timestamptz not null default now()
);

-- ---------- Запросы на генерацию ----------
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  theme_id text not null,
  variant_id text,
  custom_prompt text,
  variants_count smallint not null check (variants_count between 1 and 4),
  -- На основе какого сгенерированного фото («ещё варианты»).
  parent_image_id uuid,
  status text not null default 'pending' check (status in ('pending', 'done', 'failed')),
  error text,
  provider text,
  created_at timestamptz not null default now()
);

-- ---------- Готовые фото ----------
create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  generation_id uuid references public.generations (id) on delete cascade,
  storage_path text not null,
  -- Фото, сохранённое после редактора.
  edited boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists uploads_user_idx on public.uploads (user_id, created_at desc);
create index if not exists generations_user_idx on public.generations (user_id, created_at desc);
create index if not exists images_user_idx on public.images (user_id, created_at desc);
create index if not exists images_generation_idx on public.images (generation_id);

-- ---------- Правила доступа: каждый видит только своё ----------
alter table public.profiles enable row level security;
alter table public.uploads enable row level security;
alter table public.generations enable row level security;
alter table public.images enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "own uploads" on public.uploads;
create policy "own uploads" on public.uploads
  for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Генерации создаёт только сервер (там проверяются лимиты), пользователь их только читает.
drop policy if exists "own generations" on public.generations;
create policy "own generations" on public.generations
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "own images read" on public.images;
create policy "own images read" on public.images
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "own images delete" on public.images;
create policy "own images delete" on public.images
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------- Хранилище фото (закрытое) ----------
-- Путь каждого файла начинается с id пользователя: <user_id>/<файл>.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('uploads', 'uploads', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('generated', 'generated', false, 20971520, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "own files read" on storage.objects;
create policy "own files read" on storage.objects
  for select to authenticated
  using (bucket_id in ('uploads', 'generated') and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "own uploads write" on storage.objects;
create policy "own uploads write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "own files delete" on storage.objects;
create policy "own files delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('uploads', 'generated') and (storage.foldername(name))[1] = (select auth.uid())::text);
