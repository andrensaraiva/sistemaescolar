-- Prova da RLS de chamada — rode contra o banco LOCAL, nunca em produção.
--
--   npm run db:reset
--   docker cp supabase/tests/rls-chamada.sql supabase_db_web:/tmp/t.sql
--   docker exec supabase_db_web psql -U postgres -d postgres -f /tmp/t.sql
--
-- Roda numa transação com rollback. Cada ataque tem savepoint.
--
-- O que trava: a chamada é do DONO da turma. O aluno — mesmo membro — não lê
-- sessões nem marcas, não cria aula, não marca presença de ninguém (nem a sua).
-- Outro professor não toca na turma alheia.
--
-- Esperado: 1→0 · 2→RLS · 3→0 · 4→RLS · 5→UPDATE 0 · 6→1 · 7→(criou, numero) ·
--           8→(marcou) · 9→1 · 10→0 · 11→RLS

begin;

-- prof2 (b2) além do seed (aluno a1, prof b1).
insert into auth.users (id, instance_id, aud, role, email, encrypted_password,
                        email_confirmed_at, created_at, updated_at,
                        raw_app_meta_data, raw_user_meta_data,
                        confirmation_token, recovery_token, email_change,
                        email_change_token_new, email_change_token_current,
                        phone_change, phone_change_token, reauthentication_token)
values ('00000000-0000-0000-0000-0000000000b2',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated', 'prof2@senai.br',
        crypt('x', gen_salt('bf')), now(), now(), now(),
        '{"provider":"email"}', '{"full_name":"Prof. Dois"}',
        '', '', '', '', '', '', '', '');
update public.profiles set role = 'professor' where id = '00000000-0000-0000-0000-0000000000b2';

-- Turma do b1 com o aluno a1 dentro; turma do b2 vazia.
insert into public.classes (id, owner_id, name, invite_code) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000b1', 'Turma B1', 'ABC234'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-0000000000b2', 'Turma B2', 'XYZ789');
insert into public.class_members (class_id, student_id)
  values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000a1');

-- Uma aula da turma do b1, com o a1 marcado presente (para o aluno tentar ler/alterar).
insert into public.attendance_sessions (id, class_id, numero, data, registered_by)
  values ('20000000-0000-0000-0000-000000000001',
          '10000000-0000-0000-0000-000000000001', 1, current_date,
          '00000000-0000-0000-0000-0000000000b1');
insert into public.attendance_marks (session_id, student_id, status, registered_by)
  values ('20000000-0000-0000-0000-000000000001',
          '00000000-0000-0000-0000-0000000000a1', 'presente',
          '00000000-0000-0000-0000-0000000000b1');

-- ================================================================ como ALUNO a1
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}';

\echo '=== 1) aluno lê sessões da turma? (esperado: 0) ==='
select count(*) as sessoes_visiveis from public.attendance_sessions;

\echo '=== 2) ATAQUE aluno cria aula (esperado: RLS violation) ==='
savepoint s1;
insert into public.attendance_sessions (class_id, data, registered_by)
values ('10000000-0000-0000-0000-000000000001', current_date, '00000000-0000-0000-0000-0000000000a1');
rollback to s1;

\echo '=== 3) aluno lê marcas? (esperado: 0) ==='
select count(*) as marcas_visiveis from public.attendance_marks;

\echo '=== 4) ATAQUE aluno marca presença (esperado: RLS violation) ==='
savepoint s2;
insert into public.attendance_marks (session_id, student_id, status, registered_by)
values ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000a1', 'presente',
        '00000000-0000-0000-0000-0000000000a1');
rollback to s2;

\echo '=== 5) ATAQUE aluno altera a própria marca (esperado: UPDATE 0) ==='
savepoint s3;
update public.attendance_marks set status = 'presente'
where session_id = '20000000-0000-0000-0000-000000000001'
  and student_id = '00000000-0000-0000-0000-0000000000a1';
rollback to s3;

-- ================================================================ como PROFESSOR b1
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}';

\echo '=== 6) dono lê as sessões da sua turma? (esperado: 1) ==='
select count(*) as minhas_sessoes from public.attendance_sessions;

\echo '=== 7) LEGITIMO dono cria aula (esperado: numero = 2, auto) ==='
savepoint s4;
insert into public.attendance_sessions (class_id, data, registered_by)
values ('10000000-0000-0000-0000-000000000001', current_date, '00000000-0000-0000-0000-0000000000b1')
returning numero;
rollback to s4;

\echo '=== 8) LEGITIMO dono marca presença de outra forma (update do status) (esperado: UPDATE 1) ==='
savepoint s5;
update public.attendance_marks set status = 'falta', registered_by = '00000000-0000-0000-0000-0000000000b1'
where session_id = '20000000-0000-0000-0000-000000000001'
  and student_id = '00000000-0000-0000-0000-0000000000a1';
rollback to s5;

\echo '=== 9) dono lê as marcas da sua aula? (esperado: 1) ==='
select count(*) as minhas_marcas from public.attendance_marks;

-- ================================================================ como PROFESSOR b2
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}';

\echo '=== 10) outro professor lê sessões da turma alheia? (esperado: 0) ==='
select count(*) as sessoes_alheias from public.attendance_sessions;

\echo '=== 11) ATAQUE outro professor cria aula na turma alheia (esperado: RLS violation) ==='
savepoint s6;
insert into public.attendance_sessions (class_id, data, registered_by)
values ('10000000-0000-0000-0000-000000000001', current_date, '00000000-0000-0000-0000-0000000000b2');
rollback to s6;

rollback;
