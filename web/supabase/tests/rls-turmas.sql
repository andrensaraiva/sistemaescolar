-- Prova da RLS de turmas — rode contra o banco LOCAL, nunca em produção.
--
--   npm run db:reset
--   docker cp supabase/tests/rls-turmas.sql supabase_db_web:/tmp/t.sql
--   docker exec supabase_db_web psql -U postgres -d postgres -f /tmp/t.sql
--
-- Roda inteiro numa transação com rollback: não suja o banco. Cada ataque tem
-- savepoint, senão o primeiro erro aborta o resto.
--
-- O que estas travas protegem:
--  · a turma não é enumerável (SELECT só para dono e membro) — por isso entrar é
--    por RPC, não por SELECT do código;
--  · aluno não cria turma, não vira dono, não se insere direto em class_members;
--  · código errado não entra; código certo entra e só então o aluno passa a ver;
--  · o dono lê o perfil dos SEUS alunos, e só deles.
--
-- Esperado: 1→0 · 2→RLS · 3→denied · 4→erro código · 5→(entrou) · 5b→1 · 6→0
--           7→erro dono · 8→UPDATE 0 · 9→1 · 10a→1 · 10b→0 · 10c→1 · 11→código novo

begin;

-- Contas do seed: aluno a1, professor b1. Criamos mais um professor e um aluno
-- para testar isolamento entre donos.
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
        '', '', '', '', '', '', '', ''),
       ('00000000-0000-0000-0000-0000000000a2',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated', 'aluno2@senai.br',
        crypt('x', gen_salt('bf')), now(), now(), now(),
        '{"provider":"email"}', '{"full_name":"Aluno Dois"}',
        '', '', '', '', '', '', '', '');

update public.profiles set role = 'professor' where id = '00000000-0000-0000-0000-0000000000b2';

-- Turmas (inseridas como postgres, código explícito para o teste de entrar).
insert into public.classes (id, owner_id, name, invite_code) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000b1', 'Turma do Prof 1', 'ABC234'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-0000000000b2', 'Turma do Prof 2', 'XYZ789');

-- ================================================================ como ALUNO a1
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}';

\echo '=== 1) aluno vê turmas ANTES de entrar? (esperado: 0) ==='
select count(*) as turmas_visiveis from public.classes;

\echo '=== 2) ATAQUE aluno cria turma (esperado: RLS violation) ==='
savepoint s1;
insert into public.classes (owner_id, name)
values ('00000000-0000-0000-0000-0000000000a1', 'Turma Pirata');
rollback to s1;

\echo '=== 3) ATAQUE aluno se insere direto em class_members (esperado: permission denied) ==='
savepoint s2;
insert into public.class_members (class_id, student_id)
values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000a1');
rollback to s2;

\echo '=== 4) ATAQUE entrar com código errado (esperado: erro "não confere") ==='
savepoint s3;
select public.join_class_by_code('WRONG9');
rollback to s3;

\echo '=== 5) LEGITIMO entrar com o código certo ABC234 (esperado: 1 linha da turma) ==='
select * from public.join_class_by_code('abc234');  -- minúscula de propósito: normaliza

\echo '=== 5b) agora o aluno vê a turma que entrou? (esperado: 1) ==='
select count(*) as turmas_visiveis from public.classes;

\echo '=== 6) ATAQUE ler membros de turma alheia (esperado: 0) ==='
select count(*) as membros_alheios from public.class_members
where class_id = '10000000-0000-0000-0000-000000000002';

\echo '=== 7) ATAQUE aluno regenera código de turma alheia (esperado: erro dono) ==='
savepoint s4;
select public.regenerate_invite_code('10000000-0000-0000-0000-000000000001');
rollback to s4;

\echo '=== 8) ATAQUE aluno renomeia turma alheia (esperado: UPDATE 0) ==='
savepoint s5;
update public.classes set name = 'Hackeado' where id = '10000000-0000-0000-0000-000000000001';
rollback to s5;

-- ================================================================ como PROFESSOR b1
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}';

\echo '=== 9) professor vê a própria turma? (esperado: 1) ==='
select count(*) as minhas_turmas from public.classes;

\echo '=== 10a) professor lê o perfil do SEU aluno a1? (esperado: 1) ==='
select count(*) as perfil_do_meu_aluno from public.profiles
where id = '00000000-0000-0000-0000-0000000000a1';

\echo '=== 10b) professor lê o perfil de um aluno que NÃO é dele (esperado: 0) ==='
select count(*) as perfil_alheio from public.profiles
where id = '00000000-0000-0000-0000-0000000000a2';

\echo '=== 10c) professor lê a lista de membros da sua turma? (esperado: 1) ==='
select count(*) as membros_da_minha from public.class_members
where class_id = '10000000-0000-0000-0000-000000000001';

\echo '=== 11) LEGITIMO dono regenera o próprio código (esperado: código novo != ABC234) ==='
savepoint s6;
select public.regenerate_invite_code('10000000-0000-0000-0000-000000000001') as codigo_novo;
rollback to s6;

rollback;
