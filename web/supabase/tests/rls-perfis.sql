-- Prova da RLS de profiles — rode contra o banco LOCAL, nunca em produção.
--
--   npm run db:reset
--   docker cp supabase/tests/rls-perfis.sql supabase_db_web:/tmp/t.sql
--   docker exec supabase_db_web psql -U postgres -d postgres -f /tmp/t.sql
--
-- Roda inteiro dentro de uma transação com rollback: não suja o banco.
-- Cada ataque tem seu savepoint, senão o primeiro erro aborta o resto.
--
-- Por que existir: a migration 1 protege XP e papel via GRANT DE COLUNA, não via
-- policy — a policy autoriza a LINHA (que é do aluno mesmo), então RLS sozinha
-- deixaria `update profiles set xp=999999 where id=auth.uid()` passar. É um erro
-- fácil de reintroduzir sem perceber; este arquivo é o alarme.
--
-- Esperado: 1→1 · 2→0 · 3,4,5→permission denied · 6→UPDATE 0 · 7→UPDATE 1

begin;

insert into auth.users (id, instance_id, aud, role, email, encrypted_password,
                        email_confirmed_at, created_at, updated_at,
                        raw_app_meta_data, raw_user_meta_data)
values ('33333333-3333-3333-3333-333333333333',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated', 'a3@senai.br',
        crypt('x', gen_salt('bf')), now(), now(), now(),
        '{"provider":"email"}', '{"full_name":"Aluno Tres"}'),
       ('44444444-4444-4444-4444-444444444444',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated', 'a4@senai.br',
        crypt('x', gen_salt('bf')), now(), now(), now(),
        '{"provider":"email"}', '{"full_name":"Aluno Quatro"}');

-- A partir daqui somos o aluno, exatamente como o PostgREST o executa.
set local role authenticated;
set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}';

\echo '=== 1) le o proprio perfil? (esperado: 1) ==='
select count(*) as linhas from public.profiles;

\echo '=== 2) le o perfil do COLEGA? (esperado: 0) ==='
select count(*) as perfis_de_outros from public.profiles
where id = '44444444-4444-4444-4444-444444444444';

\echo '=== 3) ATAQUE xp (esperado: permission denied) ==='
savepoint s1;
update public.profiles set xp = 999999 where id = '33333333-3333-3333-3333-333333333333';
rollback to s1;

\echo '=== 4) ATAQUE role=admin (esperado: permission denied) ==='
savepoint s2;
update public.profiles set role = 'admin' where id = '33333333-3333-3333-3333-333333333333';
rollback to s2;

\echo '=== 5) ATAQUE is_master_admin (esperado: permission denied) ==='
savepoint s3;
update public.profiles set is_master_admin = true where id = '33333333-3333-3333-3333-333333333333';
rollback to s3;

\echo '=== 6) ATAQUE mexer no perfil do colega (esperado: UPDATE 0) ==='
savepoint s4;
update public.profiles set full_name = 'Hackeado' where id = '44444444-4444-4444-4444-444444444444';
rollback to s4;

\echo '=== 7) LEGITIMO: trocar o proprio nome (esperado: UPDATE 1) ==='
savepoint s5;
update public.profiles set full_name = 'Nome Novo' where id = '33333333-3333-3333-3333-333333333333';
select full_name from public.profiles where id = '33333333-3333-3333-3333-333333333333';
release s5;

rollback;
