begin;

-- Temel extensionlar sonraki tablolarin sade kalmasini saglar.
create extension if not exists pgcrypto with schema extensions;

-- Ortak timestamp guncellemesini tek yerde topluyoruz.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Auth kaydi olustugunda profil satirini otomatik aciyoruz.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_username text;
begin
  resolved_username := nullif(trim(new.raw_user_meta_data ->> 'username'), '');

  if resolved_username is null then
    resolved_username := 'user_' || left(replace(new.id::text, '-', ''), 8);
  end if;

  insert into public.profiles (id, username)
  values (new.id, left(resolved_username, 50))
  on conflict (id) do nothing;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  bio text not null default '',
  avatar_path text,
  skills text[] not null default '{}'::text[],
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_username_length_check check (char_length(trim(username)) between 3 and 50),
  constraint profiles_bio_length_check check (char_length(bio) <= 300),
  constraint profiles_skills_count_check check (cardinality(skills) <= 10)
);

create unique index if not exists profiles_username_lower_unique
  on public.profiles (lower(username));

create table if not exists public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (follower_id, following_id),
  constraint follows_self_follow_check check (follower_id <> following_id)
);

create index if not exists follows_following_created_idx
  on public.follows (following_id, created_at desc);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null default '',
  media_path text,
  code_language text,
  post_type text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint posts_post_type_check check (post_type in ('text', 'image', 'code')),
  constraint posts_content_length_check check (char_length(content) <= 5000),
  constraint posts_valid_payload_check check (
    (
      post_type = 'text'
      and char_length(trim(content)) > 0
      and media_path is null
      and code_language is null
    )
    or (
      post_type = 'code'
      and char_length(trim(content)) > 0
      and code_language is not null
    )
    or (
      post_type = 'image'
      and media_path is not null
      and code_language is null
    )
  )
);

create index if not exists posts_user_created_idx
  on public.posts (user_id, created_at desc);

create index if not exists posts_created_idx
  on public.posts (created_at desc);

create table if not exists public.likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (post_id, user_id)
);

create index if not exists likes_user_created_idx
  on public.likes (user_id, created_at desc);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint comments_content_check check (
    char_length(trim(content)) > 0 and char_length(content) <= 1000
  )
);

create index if not exists comments_post_created_idx
  on public.comments (post_id, created_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  receiver_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  constraint messages_not_self_check check (sender_id <> receiver_id),
  constraint messages_content_check check (
    char_length(trim(content)) > 0 and char_length(content) <= 5000
  )
);

create index if not exists messages_pair_created_idx
  on public.messages (sender_id, receiver_id, created_at desc);

create index if not exists messages_receiver_read_idx
  on public.messages (receiver_id, is_read, created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at
before update on public.comments
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

commit;