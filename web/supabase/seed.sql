-- Seed do ambiente LOCAL. Roda no `npm run db:reset`.
--
-- Separado das migrations de propósito (BLUEPRINT §4.1): migration é schema,
-- seed é dado de brincar. Isto nunca vai para produção.
--
--   aluno@senai.br  / celeste123  → papel aluno      → skin Caderno
--   prof@senai.br   / celeste123  → papel professor  → skin Dev
--
-- O perfil nasce pelo trigger on_auth_user_created; aqui só ajustamos o papel
-- do professor. Isso funciona porque o seed roda como `postgres`, e o trigger
-- guard_role_escalation só barra quem vem do PostgREST como `authenticated`.

do $$
declare
  id_aluno uuid := '00000000-0000-0000-0000-0000000000a1';
  id_prof  uuid := '00000000-0000-0000-0000-0000000000b1';
  u        record;
begin
  for u in
    select * from (values
      (id_aluno, 'aluno@senai.br', 'Ana Aluna'),
      (id_prof,  'prof@senai.br',  'Prof. André')
    ) as t(uid, email, nome)
  loop
    insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      -- Estes precisam ser STRING VAZIA, não NULL. O GoTrue lê a coluna como
      -- string em Go e morre com "converting NULL to string is unsupported",
      -- devolvendo um 500 "Database error querying schema" no login — que não
      -- diz nada sobre a causa. Só acontece com usuário inserido na mão.
      confirmation_token, recovery_token, email_change,
      email_change_token_new, email_change_token_current,
      phone_change, phone_change_token, reauthentication_token
    )
    values (
      u.uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      u.email, crypt('celeste123', gen_salt('bf')), now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object('full_name', u.nome),
      '', '', '', '', '', '', '', ''
    )
    on conflict (id) do nothing;

    -- Sem identity o signInWithPassword falha: o GoTrue procura por aqui.
    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    )
    values (
      gen_random_uuid(), u.uid, u.uid::text,
      json_build_object('sub', u.uid::text, 'email', u.email, 'email_verified', true),
      'email', now(), now(), now()
    )
    on conflict do nothing;
  end loop;

  update public.profiles set role = 'professor' where id = id_prof;
end
$$;
