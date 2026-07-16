-- Migration 3 — Chamada (frequência), o sensor mais barato do radar.
--
-- SISTEMAS §5. Decisão 16/jul: a chamada prende na TURMA (attendance_sessions →
-- classes), não em turma×UC — entrega o sensor já, sem depender do currículo. A
-- associação por UC (o diário oficial QGR, que é por UC) entra na Papelada Zero.
--
-- Leis desta fatia (SISTEMAS §5):
--  · frequência POR AULA, não por dia;
--  · atraso existe e CONTA como presença (o QGR só tem F e ., então atraso é
--    dado interno — alimenta o radar, não muda o documento);
--  · TODO lançamento tem autor (registered_by) — exigência da substituição;
--  · ausência de chamada nunca pune: sessão sem marcas = pendente, não falta.
--
-- RLS: mesmo contrato das migrations 1–2 (helpers SECURITY DEFINER, sem recursão).

-- ---------------------------------------------------------------- enum
do $$
begin
  create type public.attendance_status as enum ('presente', 'atraso', 'falta');
exception
  when duplicate_object then null;
end
$$;

-- ---------------------------------------------------------------- sessions (aulas)
create table if not exists public.attendance_sessions (
  id            uuid primary key default gen_random_uuid(),
  class_id      uuid not null references public.classes (id) on delete cascade,
  -- Numerada por turma; setada pelo trigger (max+1). É a coluna do diário.
  numero        int not null,
  data          date not null default current_date,
  -- "aula = número/período/data" (SISTEMAS §5). Período é opcional.
  periodo       text,
  registered_by uuid not null references public.profiles (id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (class_id, numero)
);

comment on table public.attendance_sessions is
  'Uma aula da turma (número/data/período). registered_by = quem aplicou (substituição).';

alter table public.attendance_sessions enable row level security;

-- ---------------------------------------------------------------- marks (presenças)
create table if not exists public.attendance_marks (
  session_id    uuid not null references public.attendance_sessions (id) on delete cascade,
  student_id    uuid not null references public.profiles (id) on delete cascade,
  status        public.attendance_status not null,
  registered_by uuid not null references public.profiles (id),
  marked_at     timestamptz not null default now(),
  primary key (session_id, student_id)
);

comment on table public.attendance_marks is
  'Presente/atraso/falta por aluno por aula. Sem marca = pendente (nunca falta).';

alter table public.attendance_marks enable row level security;

-- ---------------------------------------------------------------- helper RLS
-- O dono da turma da sessão é quem manda nas marcas. Une marca→sessão→turma por
-- baixo da RLS (SECURITY DEFINER), como is_class_owner faz para classes.
create or replace function public.is_session_owner(p_session_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.attendance_sessions s
    join public.classes c on c.id = s.class_id
    where s.id = p_session_id and c.owner_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------- triggers
-- Número da aula = próximo da turma. SECURITY DEFINER para setar sem grant na coluna.
create or replace function public.set_session_numero()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.numero is null then
    new.numero := coalesce(
      (select max(s.numero) from public.attendance_sessions s where s.class_id = new.class_id),
      0
    ) + 1;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_session_numero on public.attendance_sessions;
create trigger trg_session_numero
  before insert on public.attendance_sessions
  for each row execute function public.set_session_numero();

drop trigger if exists trg_session_updated_at on public.attendance_sessions;
create trigger trg_session_updated_at
  before update on public.attendance_sessions
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------- policies: sessions
drop policy if exists "sessao: dono lê" on public.attendance_sessions;
create policy "sessao: dono lê"
  on public.attendance_sessions for select to authenticated
  using (public.is_class_owner(class_id));

drop policy if exists "sessao: admin lê" on public.attendance_sessions;
create policy "sessao: admin lê"
  on public.attendance_sessions for select to authenticated
  using (public.is_admin());

drop policy if exists "sessao: dono cria" on public.attendance_sessions;
create policy "sessao: dono cria"
  on public.attendance_sessions for insert to authenticated
  with check (public.is_class_owner(class_id) and registered_by = (select auth.uid()));

drop policy if exists "sessao: dono edita" on public.attendance_sessions;
create policy "sessao: dono edita"
  on public.attendance_sessions for update to authenticated
  using (public.is_class_owner(class_id))
  with check (public.is_class_owner(class_id));

drop policy if exists "sessao: dono apaga" on public.attendance_sessions;
create policy "sessao: dono apaga"
  on public.attendance_sessions for delete to authenticated
  using (public.is_class_owner(class_id));

-- ---------------------------------------------------------------- policies: marks
drop policy if exists "marca: dono lê" on public.attendance_marks;
create policy "marca: dono lê"
  on public.attendance_marks for select to authenticated
  using (public.is_session_owner(session_id));

drop policy if exists "marca: admin lê" on public.attendance_marks;
create policy "marca: admin lê"
  on public.attendance_marks for select to authenticated
  using (public.is_admin());

drop policy if exists "marca: dono cria" on public.attendance_marks;
create policy "marca: dono cria"
  on public.attendance_marks for insert to authenticated
  with check (public.is_session_owner(session_id) and registered_by = (select auth.uid()));

drop policy if exists "marca: dono edita" on public.attendance_marks;
create policy "marca: dono edita"
  on public.attendance_marks for update to authenticated
  using (public.is_session_owner(session_id))
  with check (public.is_session_owner(session_id));

drop policy if exists "marca: dono apaga" on public.attendance_marks;
create policy "marca: dono apaga"
  on public.attendance_marks for delete to authenticated
  using (public.is_session_owner(session_id));

-- ---------------------------------------------------------------- grants
-- Tabela nova nasce sem grant (a lição das migrations 1–2). numero é do trigger,
-- por isso fora do grant de insert.
grant select on public.attendance_sessions to authenticated;
grant insert (class_id, data, periodo, registered_by) on public.attendance_sessions to authenticated;
grant update (data, periodo) on public.attendance_sessions to authenticated;
grant delete on public.attendance_sessions to authenticated;

grant select on public.attendance_marks to authenticated;
grant insert (session_id, student_id, status, registered_by) on public.attendance_marks to authenticated;
-- A chamada salva o roster inteiro de uma vez (upsert). O PostgREST monta o
-- upsert com DO UPDATE SET em TODAS as colunas do payload — inclusive a PK — então
-- o grant de update precisa cobri-las, senão dá "permission denied". É seguro: a
-- policy "marca: dono edita" (with check is_session_owner) é o guarda real, e o
-- upsert só reescreve os mesmos valores da PK (excluded). Nada perigoso é exposto
-- aqui (diferente de xp/role na migration 1) — mover uma marca para outra sessão
-- ainda exige ser dono das duas.
grant update (session_id, student_id, status, registered_by) on public.attendance_marks to authenticated;
grant delete on public.attendance_marks to authenticated;
