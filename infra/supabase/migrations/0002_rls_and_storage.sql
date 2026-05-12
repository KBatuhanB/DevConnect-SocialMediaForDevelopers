begin;

alter table public.profiles enable row level security;
alter table public.follows enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.messages enable row level security;

-- storage.objects Supabase tarafinda yonetilen sistem tablosudur.
-- Burada policy tanimlamak yeterlidir, RLS acma komutu yetki hatasi uretebilir.

drop policy if exists "Authenticated users can read profiles" on public.profiles;
create policy "Authenticated users can read profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Authenticated users can read follows" on public.follows;
create policy "Authenticated users can read follows"
  on public.follows
  for select
  to authenticated
  using (true);

drop policy if exists "Users can follow from own account" on public.follows;
create policy "Users can follow from own account"
  on public.follows
  for insert
  to authenticated
  with check (auth.uid() = follower_id and follower_id <> following_id);

drop policy if exists "Users can unfollow from own account" on public.follows;
create policy "Users can unfollow from own account"
  on public.follows
  for delete
  to authenticated
  using (auth.uid() = follower_id);

drop policy if exists "Authenticated users can read posts" on public.posts;
create policy "Authenticated users can read posts"
  on public.posts
  for select
  to authenticated
  using (true);

drop policy if exists "Users can create own posts" on public.posts;
create policy "Users can create own posts"
  on public.posts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own posts" on public.posts;
create policy "Users can update own posts"
  on public.posts
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own posts" on public.posts;
create policy "Users can delete own posts"
  on public.posts
  for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Authenticated users can read likes" on public.likes;
create policy "Authenticated users can read likes"
  on public.likes
  for select
  to authenticated
  using (true);

drop policy if exists "Users can like from own account" on public.likes;
create policy "Users can like from own account"
  on public.likes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can unlike from own account" on public.likes;
create policy "Users can unlike from own account"
  on public.likes
  for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Authenticated users can read comments" on public.comments;
create policy "Authenticated users can read comments"
  on public.comments
  for select
  to authenticated
  using (true);

drop policy if exists "Users can add own comments" on public.comments;
create policy "Users can add own comments"
  on public.comments
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own comments" on public.comments;
create policy "Users can delete own comments"
  on public.comments
  for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can read own messages" on public.messages;
create policy "Users can read own messages"
  on public.messages
  for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Users can send from own account" on public.messages;
create policy "Users can send from own account"
  on public.messages
  for insert
  to authenticated
  with check (auth.uid() = sender_id and sender_id <> receiver_id);

drop policy if exists "Receivers can mark messages" on public.messages;
create policy "Receivers can mark messages"
  on public.messages
  for update
  to authenticated
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'avatars',
    'avatars',
    true,
    2097152,
    array['image/png', 'image/jpeg', 'image/webp']
  ),
  (
    'post-media',
    'post-media',
    true,
    2097152,
    array['image/png', 'image/jpeg', 'image/webp']
  )
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read avatars" on storage.objects;
create policy "Public can read avatars"
  on storage.objects
  for select
  to public
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload own avatars" on storage.objects;
create policy "Users can upload own avatars"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update own avatars" on storage.objects;
create policy "Users can update own avatars"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own avatars" on storage.objects;
create policy "Users can delete own avatars"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Public can read post media" on storage.objects;
create policy "Public can read post media"
  on storage.objects
  for select
  to public
  using (bucket_id = 'post-media');

drop policy if exists "Users can upload own post media" on storage.objects;
create policy "Users can upload own post media"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'post-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update own post media" on storage.objects;
create policy "Users can update own post media"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'post-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'post-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own post media" on storage.objects;
create policy "Users can delete own post media"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'post-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

commit;