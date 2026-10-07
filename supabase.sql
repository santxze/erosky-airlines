-- AEROSKY — tabela de inscritos da newsletter
-- Rode no Supabase: Dashboard → SQL Editor → New query → colar → Run
create table if not exists newsletter_subscribers (
  id bigint generated always as identity primary key,
  email text unique not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
