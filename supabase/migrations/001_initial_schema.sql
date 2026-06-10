create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  birth_date date,
  age integer check (age is null or age between 1 and 120),
  gender text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  title text not null,
  description text not null,
  price numeric(12, 2) not null check (price >= 0),
  unit text not null check (unit in ('м²', 'шт')),
  icon text not null default '',
  category text not null default 'general',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employees (
  id text primary key,
  name text not null,
  position text not null,
  experience text not null,
  photo_url text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  service_id text not null references public.services(id),
  area numeric(12, 2),
  message text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'done', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_name text not null,
  review_text text not null,
  rating integer not null check (rating between 1 and 5),
  avatar_url text,
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.review_images (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.employees enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.review_images enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "services_public_read" on public.services;
create policy "services_public_read"
on public.services for select
using (is_active = true);

drop policy if exists "employees_public_read" on public.employees;
create policy "employees_public_read"
on public.employees for select
using (is_active = true);

drop policy if exists "reviews_public_read_published" on public.reviews;
create policy "reviews_public_read_published"
on public.reviews for select
using (status = 'published');

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own"
on public.reviews for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "review_images_public_read_published" on public.review_images;
create policy "review_images_public_read_published"
on public.review_images for select
using (
  exists (
    select 1
    from public.reviews
    where reviews.id = review_images.review_id
      and reviews.status = 'published'
  )
);

drop policy if exists "review_images_insert_own" on public.review_images;
create policy "review_images_insert_own"
on public.review_images for insert
to authenticated
with check (
  exists (
    select 1
    from public.reviews
    where reviews.id = review_images.review_id
      and reviews.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-images', 'review-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "review_images_storage_public_read" on storage.objects;
create policy "review_images_storage_public_read"
on storage.objects for select
using (bucket_id = 'review-images');

drop policy if exists "review_images_storage_insert_own_folder" on storage.objects;
create policy "review_images_storage_insert_own_folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'review-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "review_images_storage_update_own_folder" on storage.objects;
create policy "review_images_storage_update_own_folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'review-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'review-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "review_images_storage_delete_own_folder" on storage.objects;
create policy "review_images_storage_delete_own_folder"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'review-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
