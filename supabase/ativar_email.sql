-- Execute no SQL Editor do projeto Supabase de teste.
-- Nenhum pedido, prontuário ou anexo é armazenado aqui.
create table if not exists public.burncare_email_quota (
  user_id uuid not null,
  dia date not null,
  total integer not null check (total between 1 and 10),
  primary key (user_id, dia)
);
alter table public.burncare_email_quota enable row level security;
revoke all on public.burncare_email_quota from public, anon, authenticated;
create or replace function public.burncare_reservar_email(p_user uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare reservado integer;
begin
  insert into public.burncare_email_quota as q (user_id, dia, total)
    values (p_user, (now() at time zone 'UTC')::date, 1)
  on conflict (user_id, dia) do update set total = q.total + 1
    where q.total < 10
  returning total into reservado;
  return reservado is not null;
end; $$;
revoke all on function public.burncare_reservar_email(uuid) from public, anon, authenticated;
grant execute on function public.burncare_reservar_email(uuid) to service_role;
