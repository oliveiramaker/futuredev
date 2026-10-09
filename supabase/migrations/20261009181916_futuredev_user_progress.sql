-- Passwords and e-mail identity belong to Supabase Auth, not this table.
create table public.futuredev_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  revision bigint not null default 1 check (revision > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint futuredev_state_format check (
    jsonb_typeof(state) = 'object'
    and state @> '{"app":"futuredev","schema":1}'::jsonb
    and octet_length(state::text) <= 5242880
  )
);

alter table public.futuredev_progress enable row level security;
alter table public.futuredev_progress force row level security;
revoke all on public.futuredev_progress from public, anon, authenticated;
grant select, insert, update on public.futuredev_progress to authenticated;

create policy futuredev_read_own on public.futuredev_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy futuredev_insert_own on public.futuredev_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy futuredev_update_own on public.futuredev_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Optimistic concurrency: a stale browser receives HTTP 409 instead of
-- overwriting progress saved from another device. This function runs as the
-- caller, so every SQL statement still passes through RLS.
create function public.save_futuredev_progress(p_state jsonb, p_expected_revision bigint)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_row public.futuredev_progress%rowtype;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;
  if p_expected_revision is null or p_expected_revision < 0 then
    raise exception using errcode = '22023', message = 'Invalid revision';
  end if;
  if p_expected_revision = 0 then
    insert into public.futuredev_progress (user_id, state, revision)
    values (v_user_id, p_state, 1)
    on conflict (user_id) do nothing returning * into v_row;
  else
    update public.futuredev_progress
    set state = p_state, revision = revision + 1, updated_at = now()
    where user_id = v_user_id and revision = p_expected_revision
    returning * into v_row;
  end if;
  if v_row.user_id is null then
    raise exception using errcode = 'PT409', message = 'Progress revision conflict';
  end if;
  return jsonb_build_object('revision', v_row.revision, 'updated_at', v_row.updated_at);
end;
$$;

revoke all on function public.save_futuredev_progress(jsonb, bigint) from public, anon;
grant execute on function public.save_futuredev_progress(jsonb, bigint) to authenticated;
