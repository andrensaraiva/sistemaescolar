-- Migration 2 — Turmas e código de convite.
--
-- SISTEMAS §4 (turmas) + §1 (convite). Modelo: BLUEPRINT §5. RLS: §4.5 (sem
-- recursão — policy só chama função SECURITY DEFINER, nunca consulta tabela RLS
-- direto). Aditiva e idempotente, como a migration 1.
--
-- Escopo desta fatia: `classes` (dono = professor) + `class_members` (aluno ↔
-- turma) + o código de convite. `class_units` (turma × UC) fica para quando
-- existir currículo — não dá para amarrar UC que ainda não nasceu.
--
-- O fluxo de entrar é por RPC SECURITY DEFINER, não por INSERT direto: o aluno
-- precisa achar a turma pelo código SEM poder ler/enumerar turmas (a policy de
-- SELECT só libera dono e membro). A RPC acha por baixo da RLS e insere a
-- filiação. É o mesmo princípio do grant-por-coluna da migration 1: a escrita
-- passa por uma porta estreita, não pela tabela aberta.

-- ---------------------------------------------------------------- classes
create table if not exists public.classes (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles (id) on delete cascade,
  name        text not null check (length(trim(name)) between 1 and 120),
  -- Preenchido pelo trigger abaixo; NOT NULL é checado DEPOIS do BEFORE trigger.
  invite_code text not null unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.classes is
  'Turma: dono = professor (owner_id). class_units (turma×UC) virá com o currículo.';

alter table public.classes enable row level security;

-- ---------------------------------------------------------------- class_members
create table if not exists public.class_members (
  class_id   uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (class_id, student_id)
);

comment on table public.class_members is
  'Aluno ↔ turma (N:N). Só role aluno entra, e só pelo código via join_class_by_code().';

alter table public.class_members enable row level security;

-- ---------------------------------------------------------------- helpers RLS
-- Mesmo contrato dos helpers da migration 1: SECURITY DEFINER + search_path
-- fixo. Rodam por baixo da RLS de propósito — por isso podem consultar classes
-- dentro de uma policy que está sobre classes, sem recursão.
create or replace function public.is_class_owner(p_class_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.classes c
    where c.id = p_class_id and c.owner_id = (select auth.uid())
  );
$$;

create or replace function public.is_class_member(p_class_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.class_members m
    where m.class_id = p_class_id and m.student_id = (select auth.uid())
  );
$$;

-- O dono lê o perfil de quem é seu aluno — a lista da turma precisa do nome, e
-- correção/radar vão precisar de mais. Sem isto, a policy "leio o meu" de
-- profiles esconderia o aluno do próprio professor.
create or replace function public.is_my_student(p_student_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.class_members m
    join public.classes c on c.id = m.class_id
    where m.student_id = p_student_id and c.owner_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------- código
-- 6 chars de um alfabeto SEM ambíguos (0/O, 1/I/L) — o código é ditado no
-- quadro, então tem que ser à prova de "isso é zero ou ó?". Sem expiração
-- (decisão 16/jul): menos atrito no 1º semestre; o dono regenera se precisar.
create or replace function public.gen_invite_code()
returns text language plpgsql volatile security definer set search_path = '' as $$
declare
  alfabeto constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  codigo   text;
  i        int;
begin
  loop
    codigo := '';
    for i in 1..6 loop
      codigo := codigo || substr(alfabeto, 1 + floor(random() * length(alfabeto))::int, 1);
    end loop;
    exit when not exists (select 1 from public.classes c where c.invite_code = codigo);
  end loop;
  return codigo;
end;
$$;

-- SECURITY DEFINER de propósito: assim o trigger seta invite_code sem exigir que
-- o professor tenha grant de INSERT naquela coluna (ele não tem — ver grants).
create or replace function public.set_invite_code()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.invite_code is null or new.invite_code = '' then
    new.invite_code := public.gen_invite_code();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_classes_invite_code on public.classes;
create trigger trg_classes_invite_code
  before insert on public.classes
  for each row execute function public.set_invite_code();

-- updated_at reaproveita o touch_updated_at() da migration 1.
drop trigger if exists trg_classes_updated_at on public.classes;
create trigger trg_classes_updated_at
  before update on public.classes
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------- RPC: entrar
-- A única porta de entrada em class_members. Não existe policy de INSERT para
-- authenticated — quem insere é esta função, por baixo da RLS.
create or replace function public.join_class_by_code(p_code text)
returns table (class_id uuid, class_name text)
language plpgsql volatile security definer set search_path = '' as $$
declare
  v_class public.classes;
begin
  -- Só aluno vira membro. Professor/coordenador na turma são outra coisa
  -- (co-docência), que não é esta fatia.
  if public.my_role() is distinct from 'aluno' then
    raise exception 'Só aluno entra em turma por código.' using errcode = '42501';
  end if;

  select * into v_class from public.classes c
  where c.invite_code = upper(trim(p_code));

  if not found then
    raise exception 'Código não confere. Confira o que o professor passou.'
      using errcode = 'P0002';
  end if;

  insert into public.class_members (class_id, student_id)
  values (v_class.id, (select auth.uid()))
  on conflict do nothing;

  return query select v_class.id, v_class.name;
end;
$$;

-- ---------------------------------------------------------------- RPC: regenerar
create or replace function public.regenerate_invite_code(p_class_id uuid)
returns text language plpgsql volatile security definer set search_path = '' as $$
declare
  v_code text;
begin
  if not exists (
    select 1 from public.classes c
    where c.id = p_class_id and c.owner_id = (select auth.uid())
  ) then
    raise exception 'Só o dono da turma regenera o código.' using errcode = '42501';
  end if;

  v_code := public.gen_invite_code();
  update public.classes set invite_code = v_code where id = p_class_id;
  return v_code;
end;
$$;

-- ---------------------------------------------------------------- policies: classes
drop policy if exists "turma: dono lê" on public.classes;
create policy "turma: dono lê"
  on public.classes for select to authenticated
  using (public.is_class_owner(id));

drop policy if exists "turma: membro lê" on public.classes;
create policy "turma: membro lê"
  on public.classes for select to authenticated
  using (public.is_class_member(id));

drop policy if exists "turma: admin lê" on public.classes;
create policy "turma: admin lê"
  on public.classes for select to authenticated
  using (public.is_admin());

drop policy if exists "turma: professor cria a sua" on public.classes;
create policy "turma: professor cria a sua"
  on public.classes for insert to authenticated
  with check (owner_id = (select auth.uid()) and public.is_professor());

drop policy if exists "turma: dono edita" on public.classes;
create policy "turma: dono edita"
  on public.classes for update to authenticated
  using (public.is_class_owner(id))
  with check (public.is_class_owner(id));

drop policy if exists "turma: dono apaga" on public.classes;
create policy "turma: dono apaga"
  on public.classes for delete to authenticated
  using (public.is_class_owner(id));

-- ---------------------------------------------------------------- policies: class_members
drop policy if exists "membro: dono da turma vê" on public.class_members;
create policy "membro: dono da turma vê"
  on public.class_members for select to authenticated
  using (public.is_class_owner(class_id));

drop policy if exists "membro: aluno vê o seu" on public.class_members;
create policy "membro: aluno vê o seu"
  on public.class_members for select to authenticated
  using (student_id = (select auth.uid()));

drop policy if exists "membro: admin vê" on public.class_members;
create policy "membro: admin vê"
  on public.class_members for select to authenticated
  using (public.is_admin());

-- Turma errada acontece: o dono tira, o aluno também pode sair da sua.
drop policy if exists "membro: dono remove" on public.class_members;
create policy "membro: dono remove"
  on public.class_members for delete to authenticated
  using (public.is_class_owner(class_id));

drop policy if exists "membro: aluno sai" on public.class_members;
create policy "membro: aluno sai"
  on public.class_members for delete to authenticated
  using (student_id = (select auth.uid()));

-- ---------------------------------------------------------------- policies: profiles
drop policy if exists "perfil: professor lê seus alunos" on public.profiles;
create policy "perfil: professor lê seus alunos"
  on public.profiles for select to authenticated
  using (public.is_my_student(id));

-- ---------------------------------------------------------------- grants
-- Tabela nova nasce sem grant (a lição da migration 1). Concedemos o mínimo:
-- classes: professor insere só (owner_id, name) — o código é do trigger, o resto
-- é default. Dono edita só (name, invite_code) — NUNCA owner_id, senão sequestra
-- turma dos outros.
grant select on public.classes to authenticated;
grant insert (owner_id, name) on public.classes to authenticated;
grant update (name, invite_code) on public.classes to authenticated;
grant delete on public.classes to authenticated;

-- class_members: leitura filtrada por RLS + delete (remover/sair). INSERT NÃO
-- tem grant nenhum: entrar é exclusivamente pela RPC join_class_by_code.
grant select on public.class_members to authenticated;
grant delete on public.class_members to authenticated;

grant execute on function public.join_class_by_code(text) to authenticated;
grant execute on function public.regenerate_invite_code(uuid) to authenticated;
