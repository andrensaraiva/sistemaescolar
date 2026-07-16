-- Migration 1 — Fundação: identidade, papéis e os helpers de RLS.
--
-- BLUEPRINT §4: migrations são a ÚNICA fonte da verdade do schema (não existe
-- SETUP_COMPLETO.sql paralelo — foi a dívida nº 1 do sistema antigo). Aditiva e
-- idempotente: rodar duas vezes não quebra.
--
-- BLUEPRINT §4.5: RLS sem recursão. Policy NUNCA consulta tabela com RLS direto
-- (dá "stack depth limit exceeded"); só chama função SECURITY DEFINER, que
-- passa por baixo da RLS de propósito.
--
-- Toda função SECURITY DEFINER aqui fixa "set search_path = ''" e qualifica os
-- nomes. Sem isso, quem controla o search_path escolhe qual "profiles" a função
-- lê — e a função roda com os poderes do dono.

-- ---------------------------------------------------------------- papéis
do $$
begin
  create type public.user_role as enum ('aluno', 'professor', 'coordenador', 'admin');
exception
  when duplicate_object then null;
end
$$;

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id                   uuid primary key references auth.users (id) on delete cascade,
  role                 public.user_role not null default 'aluno',
  is_master_admin      boolean not null default false,
  full_name            text,
  -- Dois e-mails por pessoa, ambos logam (BLUEPRINT §3).
  institutional_email  text unique,
  personal_email       text unique,
  -- Primeiro acesso força troca de senha + completar perfil (BLUEPRINT §3).
  must_change_password boolean not null default true,
  profile_completed    boolean not null default false,
  -- Gamificação (BLUEPRINT §5). Moedas são derivadas do nível: não têm coluna.
  xp                   integer not null default 0 check (xp >= 0),
  level                integer not null default 1 check (level >= 1),
  streak               integer not null default 0 check (streak >= 0),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

comment on table public.profiles is
  'Uma linha por pessoa, 1:1 com auth.users. role e is_master_admin só mudam por admin (ver trigger).';

alter table public.profiles enable row level security;

-- ---------------------------------------------------------------- helpers
-- "current_role" é palavra reservada no Postgres; por isso my_role().
create or replace function public.my_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p where p.id = (select auth.uid());
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.my_role() = 'admin', false);
$$;

create or replace function public.is_professor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.my_role() = 'professor', false);
$$;

create or replace function public.is_coordenador()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.my_role() = 'coordenador', false);
$$;

create or replace function public.is_master_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.is_master_admin from public.profiles p where p.id = (select auth.uid())),
    false
  );
$$;

-- ---------------------------------------------------------------- policies
-- Sem cadastro aberto: não existe policy de INSERT para authenticated. Perfil
-- nasce pelo trigger abaixo, e o vínculo com turma virá pelo código de convite.
drop policy if exists "perfil: leio o meu" on public.profiles;
create policy "perfil: leio o meu"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "perfil: admin le todos" on public.profiles;
create policy "perfil: admin le todos"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists "perfil: atualizo o meu" on public.profiles;
create policy "perfil: atualizo o meu"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "perfil: admin atualiza todos" on public.profiles;
create policy "perfil: admin atualiza todos"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------- grants
-- O Postgres checa o GRANT ANTES da RLS: sem grant, a policy nunca roda. Nesta
-- versão do Supabase, tabela nova nasce sem privilégio nenhum para
-- authenticated — o que é ótimo, porque obriga a conceder por COLUNA.
--
-- É aqui que mora a proteção do XP, e é por construção: a policy "atualizo o
-- meu" autoriza a LINHA (ela é minha mesmo), então RLS sozinha deixaria o aluno
-- rodar `update profiles set xp=999999 where id=auth.uid()` e ele passaria no
-- with check. Quem tem que ser protegida é a COLUNA. XP, nível e streak não
-- estão na lista: eles são calculados pelo fluxo de correção, nunca escritos
-- pelo dono do perfil. Testado com o aluno de verdade, não suposto.
grant select on public.profiles to authenticated;
grant update (full_name, personal_email, profile_completed) on public.profiles to authenticated;

-- ------------------------------------------------- trava de escalonamento
-- Defesa em profundidade (BLUEPRINT §4.4): role/is_master_admin já não estão no
-- grant acima, então isto é o cinto além do suspensório — se alguém um dia
-- conceder a coluna por engano, o trigger ainda barra.
create or replace function public.guard_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     or new.is_master_admin is distinct from old.is_master_admin then
    -- Só barra quem vem do PostgREST como usuário logado. Backend passa:
    -- postgres (migrations e seed) e service_role não têm auth.uid(), e barrá-los
    -- tornaria impossível criar o primeiro admin.
    if current_user = 'authenticated' and not public.is_admin() then
      raise exception 'Só um admin altera papel ou is_master_admin.'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_role_escalation on public.profiles;
create trigger trg_guard_role_escalation
  before update on public.profiles
  for each row execute function public.guard_role_escalation();

-- ---------------------------------------------------------------- updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------- perfil nasce com o usuário
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, institutional_email)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
